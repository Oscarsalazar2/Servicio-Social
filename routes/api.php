<?php

use App\Http\Controllers\Api\LecturasController;
use Illuminate\Support\Facades\Route;

Route::get('/lecturas', [LecturasController::class, 'index']);
Route::post('/lecturas', [LecturasController::class, 'store']);
