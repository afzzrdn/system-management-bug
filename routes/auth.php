<?php

use App\Http\Controllers\Auth\AuthController;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/logout',   [AuthController::class, 'logout'])->middleware('auth');
Route::get('/me',        [AuthController::class, 'me'])->middleware('auth');