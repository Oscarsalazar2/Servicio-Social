<?php

use App\Http\Controllers\ProfileController;
use App\Models\AuditLog;
use App\Models\User;
use App\Notifications\UserStatusChangedNotification;
use App\Services\TelegramService;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*RUTAS PÚBLICAS*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*RUTAS PRIVADAS (auth + verified)*/
Route::middleware(['auth', 'verified'])->group(function () {
    // DASHBOARD
    Route::get('/dashboard', fn() => Inertia::render('Dashboard/Dashboard'))->name('dashboard');
    Route::get('/dashboard/viento', fn() => Inertia::render('Dashboard/Viento'))->name('dashboard.wind');
    Route::get('/dashboard/temperatura', fn() => Inertia::render('Dashboard/Temperatura'))->name('dashboard.temp');
    Route::get('/dashboard/cielo', fn() => Inertia::render('Dashboard/Cielo'))->name('dashboard.sky');
    Route::get('/dashboard/presion', fn() => Inertia::render('Dashboard/Presion'))->name('dashboard.pressure');

    // LANZAMIENTOS (admin o launcher)
    Route::middleware('launcher.or.admin')->group(function () {
        Route::get('/lanzamientos', fn() => Inertia::render('Lanzamientos/Index'))->name('lanzamientos.index');
    });

    // ADMIN (solo admin)
    Route::middleware('admin')->group(function () {
        // Entrada principal del módulo admin
        Route::get('/admin', fn() => Inertia::render('Admin/Index'))->name('admin');

        // Panel admin (estadísticas + usuarios + auditoría)
        Route::get('/admin/panel', function () {
            // Usuarios pendientes (sin rol definido o distinto de rechazado)
            $pendingUsers = User::where('is_active', false)
                ->where(function ($query) {
                    $query->whereNull('role')
                        ->orWhere('role', '!=', 'rejected');
                })
                ->select('id', 'name', 'email', 'motivo', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            // Usuarios rechazados
            $rejectedUsers = User::where('role', 'rejected')
                ->where('is_active', false)
                ->select('id', 'name', 'email', 'motivo', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            // Todos los usuarios (para la tabla de gestión)
            $allUsers = User::query()
                ->select('id', 'name', 'email', 'role', 'motivo', 'created_at', 'is_active')
                ->orderBy('created_at', 'desc')
                ->get();

            // Últimos eventos de auditoría
            $auditLogs = AuditLog::query()
                ->select(
                    'id',
                    'actor_id',
                    'actor_name',
                    'action',
                    'target_user_id',
                    'target_user_name',
                    'target_user_email',
                    'metadata',
                    'ip_address',
                    'created_at'
                )
                ->orderBy('created_at', 'desc')
                ->limit(150)
                ->get();

            return Inertia::render('Admin/Panel', [
                'pendingActivations' => $pendingUsers->count(),
                'rejectedCount' => $rejectedUsers->count(),
                'pendingUsers' => $pendingUsers,
                'rejectedUsers' => $rejectedUsers,
                'allUsers' => $allUsers,
                'auditLogs' => $auditLogs,
            ]);
        })->name('admin.panel');

        //ACCIONES DE APROBACIÓN
        // Activar usuario
        Route::post('/admin/users/{user}/activate', function (User $user, Request $request) {
            $user->update(['is_active' => true]);
            $user->notify(new UserStatusChangedNotification('accepted'));

            AuditLog::create([
                'actor_id' => $request->user()?->id,
                'actor_name' => $request->user()?->name ?? 'Administrador',
                'action' => 'user.activated',
                'target_user_id' => $user->id,
                'target_user_name' => $user->name,
                'target_user_email' => $user->email,
                'metadata' => ['status' => 'active'],
                'ip_address' => $request->ip(),
                'user_agent' => (string) $request->userAgent(),
            ]);

            return redirect()->back()->with('success', 'Usuario activado correctamente');
        })->name('admin.users.activate');

        // Rechazar usuario
        Route::post('/admin/users/{user}/reject', function (User $user, Request $request) {
            $user->notify(new UserStatusChangedNotification('rejected'));

            $user->update([
                'is_active' => false,
                'role' => 'rejected',
            ]);

            AuditLog::create([
                'actor_id' => $request->user()?->id,
                'actor_name' => $request->user()?->name ?? 'Administrador',
                'action' => 'user.rejected',
                'target_user_id' => $user->id,
                'target_user_name' => $user->name,
                'target_user_email' => $user->email,
                'metadata' => ['status' => 'rejected'],
                'ip_address' => $request->ip(),
                'user_agent' => (string) $request->userAgent(),
            ]);

            return redirect()->back()->with('success', 'Usuario rechazado correctamente');
        })->name('admin.users.reject');

        // Reabrir solicitud rechazada
        Route::post('/admin/users/{user}/reopen', function (User $user, TelegramService $telegram, Request $request) {
            $user->update([
                'is_active' => false,
                'role' => 'user',
            ]);

            $telegram->sendToUser(
                $user,
                "<b>Solicitud reabierta</b>\nHola {$user->name}, tu solicitud fue reabierta y está nuevamente pendiente de revisión."
            );

            AuditLog::create([
                'actor_id' => $request->user()?->id,
                'actor_name' => $request->user()?->name ?? 'Administrador',
                'action' => 'user.reopened',
                'target_user_id' => $user->id,
                'target_user_name' => $user->name,
                'target_user_email' => $user->email,
                'metadata' => ['status' => 'pending'],
                'ip_address' => $request->ip(),
                'user_agent' => (string) $request->userAgent(),
            ]);

            return redirect()->back()->with('success', 'Solicitud reabierta correctamente');
        })->name('admin.users.reopen');

        // GESTIÓN DE USUARIOS
        // Cambiar estado activo/inactivo
        Route::post('/admin/users/{user}/toggle-status', function (User $user, Request $request) {
            $user->update(['is_active' => !$user->is_active]);
            $status = $user->is_active ? 'activado' : 'desactivado';

            if (!$user->is_active) {
                $user->notify(new UserStatusChangedNotification('suspended'));
            }

            AuditLog::create([
                'actor_id' => $request->user()?->id,
                'actor_name' => $request->user()?->name ?? 'Administrador',
                'action' => 'user.toggled_status',
                'target_user_id' => $user->id,
                'target_user_name' => $user->name,
                'target_user_email' => $user->email,
                'metadata' => ['status' => $status],
                'ip_address' => $request->ip(),
                'user_agent' => (string) $request->userAgent(),
            ]);

            return redirect()->back()->with('success', "Usuario {$status} correctamente");
        })->name('admin.users.toggle-status');

        // Editar datos del usuario (nombre, correo, rol, estado)
        Route::patch('/admin/users/{user}', function (User $user, Request $request) {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email:rfc,dns', 'max:255', 'unique:users,email,' . $user->id],
                'role' => ['required', 'string', 'in:Admin,Lanzador,Usuario,Rechazado'],
                'status' => ['required', 'string', 'in:Activo,Inactivo'],
            ]);

            $roleMap = [
                'Admin' => 'admin',
                'Lanzador' => 'launcher',
                'Usuario' => 'user',
                'Rechazado' => 'rejected',
            ];

            $statusMap = [
                'Activo' => true,
                'Inactivo' => false,
            ];

            $oldValues = [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
            ];

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $roleMap[$validated['role']] ?? 'user',
                'is_active' => $statusMap[$validated['status']] ?? true,
            ]);

            AuditLog::create([
                'actor_id' => $request->user()?->id,
                'actor_name' => $request->user()?->name ?? 'Administrador',
                'action' => 'user.updated',
                'target_user_id' => $user->id,
                'target_user_name' => $user->name,
                'target_user_email' => $user->email,
                'metadata' => [
                    'old' => $oldValues,
                    'new' => [
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'is_active' => $user->is_active,
                    ],
                ],
                'ip_address' => $request->ip(),
                'user_agent' => (string) $request->userAgent(),
            ]);

            return redirect()->back()->with('success', 'Usuario actualizado correctamente');
        })->name('admin.users.update');

        // Eliminar usuario
        Route::delete('/admin/users/{user}', function (User $user, TelegramService $telegram, Request $request) {
            $telegram->sendToUser(
                $user,
                "<b>Cuenta eliminada</b>\nHola {$user->name}, tu cuenta fue eliminada por un administrador."
            );

            AuditLog::create([
                'actor_id' => $request->user()?->id,
                'actor_name' => $request->user()?->name ?? 'Administrador',
                'action' => 'user.deleted',
                'target_user_id' => $user->id,
                'target_user_name' => $user->name,
                'target_user_email' => $user->email,
                'metadata' => ['status' => 'deleted'],
                'ip_address' => $request->ip(),
                'user_agent' => (string) $request->userAgent(),
            ]);

            $user->delete();
            return redirect()->back()->with('success', 'Usuario eliminado correctamente');
        })->name('admin.users.delete');
    });
});

/*PERFIL DE USUARIO (auth)*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*AUTENTICACIÓN LARAVEL BREEZE / JETSTREAM*/
require __DIR__ . '/auth.php';

/*UTILIDADES / TESTING*/
Route::get('/test-mail', function () {
    Mail::raw("Mensaje de prueba METEOR 🚀", function ($message) {
        $message->to("oskar.salazar2016@gmail.com")
            ->subject("Luis Gay Gmail");
    });

    return "Correo enviado";
});
