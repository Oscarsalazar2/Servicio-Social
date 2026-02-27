<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
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

/*RUTAS PRIVADAS MODULARES*/
require __DIR__ . '/dashboard.php';
require __DIR__ . '/lanzamientos.php';
require __DIR__ . '/admin.php';

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
