<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\BugController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

Route::get('/', fn () => Redirect::to('/login'));

Route::get('/login', fn () => Inertia::render('auth/login'))->name('login');
Route::get('/register', fn () => Inertia::render('auth/register'))->name('register');


Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $role = method_exists($user->role, 'value') ? $user->role->value : $user->role;

        return match ($role) {
            'admin'     => redirect('/admin/dashboard'),
            'developer' => redirect('/developer/dashboard'),
            'client'    => redirect('/client/dashboard'),
            default     => abort(403),
        };
    })->name('dashboard');
});


// ==============================
// ROUTE PER ROLE
// ==============================

// ADMIN ROUTES
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::resource('/users', UserController::class);
    Route::resource('bugs', BugController::class)->names([
        'index'   => 'bugs.index',
        'store'   => 'bugs.store',
        'update'  => 'bugs.update',
        'destroy' => 'bugs.destroy',
    ])->parameters([
        'bugs' => 'bug',
    ]);
    Route::resource('project', ProjectController::class)->names([
        'index' => 'projects.index',
        'store' => 'projects.store',
        'update' => 'projects.update',
        'destroy' => 'projects.destroy',
    ])->parameters([
        'projects' => 'project',
    ]);
});

// DEVELOPER ROUTES
Route::middleware(['auth', 'role:developer'])->prefix('developer')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Developer\DashboardController::class, 'index'])->name('dashboard');
    // Tambah route developer lain di sini
});

// CLIENT ROUTES
Route::middleware(['auth', 'role:client'])->prefix('client')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('client/dashboard'))->name('client.dashboard');
    // Tambah route client lain di sini
});

require __DIR__.'/auth.php';
