<?php

use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
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

    /* Lanzamientos - Acceso para Admin y Launcher */
    Route::middleware('launcher.or.admin')->group(function () {
        Route::get('/lanzamientos', fn() => Inertia::render('Lanzamientos/Index'))->name('lanzamientos.index');
    });

    /*Admin - Solo Admin*/
    Route::middleware('admin')->group(function () {
        Route::get('/admin', fn() => Inertia::render('Admin/Index'))->name('admin');

        Route::get('/admin/panel', function () {
            $pendingUsers = User::where('is_active', false)
                ->select('id', 'name', 'email', 'motivo', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            $allUsers = User::where('is_active', true)
                ->select('id', 'name', 'email', 'role', 'created_at', 'is_active')
                ->orderBy('created_at', 'desc')
                ->get();

            return Inertia::render('Admin/Panel', [
                'pendingActivations' => $pendingUsers->count(),
                'pendingUsers' => $pendingUsers,
                'allUsers' => $allUsers
            ]);
        })->name('admin.panel');

        // Rutas para activar/rechazar usuarios
        Route::post('/admin/users/{user}/activate', function (User $user) {
            $user->update(['is_active' => true]);
            return redirect()->back()->with('success', 'Usuario activado correctamente');
        })->name('admin.users.activate');

        Route::post('/admin/users/{user}/reject', function (User $user) {
            $user->delete();
            return redirect()->back()->with('success', 'Usuario rechazado correctamente');
        })->name('admin.users.reject');

        // Rutas para gestión de usuarios
        Route::post('/admin/users/{user}/toggle-status', function (User $user) {
            $user->update(['is_active' => !$user->is_active]);
            $status = $user->is_active ? 'activado' : 'desactivado';
            return redirect()->back()->with('success', "Usuario {$status} correctamente");
        })->name('admin.users.toggle-status');

        Route::delete('/admin/users/{user}', function (User $user) {
            $user->delete();
            return redirect()->back()->with('success', 'Usuario eliminado correctamente');
        })->name('admin.users.delete');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
