<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard/Dashboard'))->name('dashboard');
    Route::get('/dashboard/viento', fn() => Inertia::render('Dashboard/Viento'))->name('dashboard.wind');
    Route::get('/dashboard/temperatura', fn() => Inertia::render('Dashboard/Temperatura'))->name('dashboard.temp');
    Route::get('/dashboard/cielo', fn() => Inertia::render('Dashboard/Cielo'))->name('dashboard.sky');
    Route::get('/dashboard/presion', fn() => Inertia::render('Dashboard/Presion'))->name('dashboard.pressure');
});
