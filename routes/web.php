<?php

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


Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware('auth')->name('dashboard');

require __DIR__.'/auth.php';
