<?php

use App\Http\Controllers\ProfileController;
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

    // ✅ Dashboard (elige una como default)
    // Si tu dashboard completo está en: resources/js/Pages/Dashboard/Dashboard.jsx
    // entonces usa esto:
    Route::get('/dashboard', fn () => Inertia::render('Dashboard/Dashboard'))->name('dashboard');

    // ✅ Si prefieres que /dashboard mande directo a /dashboard/viento, usa este en vez del de arriba:
    // Route::get('/dashboard', fn () => redirect()->route('dashboard.wind'))->name('dashboard');

    // ✅ Páginas separadas
    Route::get('/dashboard/viento', fn () => Inertia::render('Dashboard/Wind'))->name('dashboard.wind');
    Route::get('/dashboard/temperatura', fn () => Inertia::render('Dashboard/Temperature'))->name('dashboard.temp');

    // ✅ Admin (solo admin)
    Route::get('/admin', fn () => Inertia::render('Admin'))
        ->middleware('admin')
        ->name('admin');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
