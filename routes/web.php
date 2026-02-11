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
    /*Admin*/
    Route::middleware('admin')->group(function () {
        Route::get('/admin', fn() => Inertia::render('Admin/Index'))->name('admin');

        Route::get('/lanzamientos', fn() => Inertia::render('Lanzamientos/Index'))->name('lanzamientos.index');
        Route::get('/admin/panel', function () {
            $pendingActivations = User::where('is_active', false)->count();
            return Inertia::render('Admin/Panel', [
                'pendingActivations' => $pendingActivations
            ]);
        })->name('admin.panel');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
