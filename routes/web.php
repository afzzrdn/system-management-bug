<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

Route::get('/', function () {
    return Redirect::route('dashboard');
});

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->name('login');
Route::get('/register', function () {
    return Inertia::render('auth/register');
})->name('register');


Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class);
});
Route::middleware('auth')->group(function () {
    Route::get('/user', [UserController::class, 'index'])->name('users.index');
    Route::resource('user', UserController::class)
        ->except(['index'])
        ->names('users');
});

require __DIR__.'/auth.php';
