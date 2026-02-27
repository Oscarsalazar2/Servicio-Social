<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'launcher.or.admin'])->group(function () {
    Route::get('/lanzamientos', fn() => Inertia::render('Lanzamientos/Index'))->name('lanzamientos.index');
});
