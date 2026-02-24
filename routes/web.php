<?php

use App\Http\Controllers\ProfileController;
use App\Models\AuditLog;
use App\Models\User;
use App\Services\TelegramService;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', fn() => Inertia::render('Dashboard/Dashboard'))->name('dashboard');
    Route::get('/dashboard/viento', fn() => Inertia::render('Dashboard/Viento'))->name('dashboard.wind');
    Route::get('/dashboard/temperatura', fn() => Inertia::render('Dashboard/Temperatura'))->name('dashboard.temp');
    Route::get('/dashboard/clima', fn() => Inertia::render('Dashboard/Clima'))->name('dashboard.climate');
    Route::get('/dashboard/presion', fn()=>Inertia::render('Dashboard/Presion'))->name('dashboard.pressure');

    /* Lanzamientos - Acceso para Admin y Launcher */
    Route::middleware('launcher.or.admin')->group(function () {
        Route::get('/lanzamientos', fn() => Inertia::render('Lanzamientos/Index'))->name('lanzamientos.index');
    });

    /*Admin - Solo Admin*/
    Route::middleware('admin')->group(function () {
        Route::get('/admin', fn() => Inertia::render('Admin/Index'))->name('admin');

        Route::get('/admin/panel', function () {
            $pendingUsers = User::where('is_active', false)
                ->where(function ($query) {
                    $query->whereNull('role')
                        ->orWhere('role', '!=', 'rejected');
                })
                ->select('id', 'name', 'email', 'motivo', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            $rejectedUsers = User::where('role', 'rejected')
                ->where('is_active', false)
                ->select('id', 'name', 'email', 'motivo', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            $allUsers = User::where('is_active', true)
                ->select('id', 'name', 'email', 'role', 'created_at', 'is_active')
                ->orderBy('created_at', 'desc')
                ->get();

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

        // Rutas para activar/rechazar usuarios
        Route::post('/admin/users/{user}/activate', function (User $user, TelegramService $telegram, Request $request) {
            $user->update(['is_active' => true]);

            $telegram->sendToUser(
                $user,
                "✅ <b>Cuenta activada</b>\nHola {$user->name}, tu cuenta fue activada y ya puedes usar la plataforma."
            );

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

        Route::post('/admin/users/{user}/reject', function (User $user, TelegramService $telegram, Request $request) {
            $telegram->sendToUser(
                $user,
                "❌ <b>Solicitud rechazada</b>\nHola {$user->name}, tu solicitud de acceso fue rechazada."
            );

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

        Route::post('/admin/users/{user}/reopen', function (User $user, TelegramService $telegram, Request $request) {
            $user->update([
                'is_active' => false,
                'role' => 'user',
            ]);

            $telegram->sendToUser(
                $user,
                "🔄 <b>Solicitud reabierta</b>\nHola {$user->name}, tu solicitud fue reabierta y está nuevamente pendiente de revisión."
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

        // Rutas para gestión de usuarios
        Route::post('/admin/users/{user}/toggle-status', function (User $user, TelegramService $telegram, Request $request) {
            $user->update(['is_active' => !$user->is_active]);
            $status = $user->is_active ? 'activado' : 'desactivado';

            $icon = $user->is_active ? '✅' : '⛔';
            $telegram->sendToUser(
                $user,
                "{$icon} <b>Estado de cuenta actualizado</b>\nHola {$user->name}, tu cuenta fue {$status} por un administrador."
            );

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

        Route::delete('/admin/users/{user}', function (User $user, TelegramService $telegram, Request $request) {
            $telegram->sendToUser(
                $user,
                "🗑️ <b>Cuenta eliminada</b>\nHola {$user->name}, tu cuenta fue eliminada por un administrador."
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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/telegram/test', [ProfileController::class, 'testTelegram'])->name('profile.telegram.test');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

Route::get('/test-mail', function () {
    Mail::raw("Mensaje de prueba METEOR 🚀", function ($message) {
        $message->to("oskar.salazar2016@gmail.com")
                ->subject("Luis Gay Gmail");
    });

    return "Correo enviado";
});
