<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\BugController as AdminBugController;
use App\Http\Controllers\Client\BugController as ClientBugController;
use App\Http\Controllers\Developer\DashboardController as DeveloperDashboardController;
use App\Http\Controllers\Developer\BugController as DeveloperBugController;
use App\Http\Controllers\NotificationController;
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
    Route::get('/notification', [NotificationController::class, 'index'])->name('notification.index');
    Route::get('/notifications/unread-count', function () {
        return response()->json([
            'count' => \App\Models\Notification::where('user_id', auth()->id())->where('is_read', false)->count()
        ]);
    })->name('notifications.unread-count');
    Route::get('/customer-service',  fn () => Inertia::render('customer-service'))->name('customer-service.index');
});


// ==============================
// ROUTE PER ROLE
// ==============================

// ADMIN ROUTES
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::resource('/users', UserController::class);
    Route::resource('bugs', AdminBugController::class)->names([
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
    Route::get('/dashboard', [DeveloperDashboardController::class, 'index'])->name('dashboard');
     Route::get('/bugs', [DeveloperBugController::class, 'index'])->name('developer.bugs.index');
     Route::get('/bugs/{bug}', [DeveloperBugController::class, 'show'])->name('developer.bugs.show');

});

// CLIENT ROUTES
// CLIENT ROUTES
Route::middleware(['auth', 'role:client'])->prefix('client')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Client\DashboardController::class, 'index'])->name('client.dashboard');
    Route::get('/project', [\App\Http\Controllers\Client\ProjectController::class, 'index'])->name('client.project');
    Route::get('/project/{project}', [\App\Http\Controllers\Client\ProjectController::class, 'show'])->name('client.project.show');
    Route::resource('bugs', ClientBugController::class)->names([
        'index'   => 'client.bugs.index',
        'store'   => 'client.bugs.store',
        'update'  => 'client.bugs.update',
        'destroy' => 'client.bugs.destroy',
    ])->parameters([
        'bugs' => 'bug',
    ]);
});


require __DIR__.'/auth.php';
