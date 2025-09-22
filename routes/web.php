<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\BugController as AdminBugController;
use App\Http\Controllers\Client\BugController as ClientBugController;
use App\Http\Controllers\CustomerServiceController;
use App\Http\Controllers\Developer\DashboardController as DeveloperDashboardController;
use App\Http\Controllers\Developer\BugController as DeveloperBugController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Developer\AttachmentController;
use App\Http\Controllers\Developer\BoardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WablasController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\PasswordResetController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

Route::get('/', fn() => Redirect::to('/login'));

Route::get('/login', fn() => Inertia::render('auth/login'))->name('login');
Route::get('/register', fn() => Inertia::render('auth/register'))->name('register');

// Password Reset Routes
Route::get('/forgot-password', [PasswordResetController::class, 'showForgotForm'])->name('password.request');
Route::post('/forgot-password', [PasswordResetController::class, 'sendOtp']);
Route::get('/verify-otp', [PasswordResetController::class, 'showVerifyForm'])->name('password.verify');
Route::post('/verify-otp', [PasswordResetController::class, 'verifyOtp'])->name('password.verify-otp');
Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetForm'])->name('password.reset.form');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->name('password.reset');

// WEBHOOK WABLAS (untuk menerima pesan masuk dari WhatsApp)
Route::post('/wablas/webhook', [WablasController::class, 'handleWebhook'])->name('wablas.webhook');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $role = method_exists($user->role, 'value') ? $user->role->value : $user->role;

        return match ($role) {
            'admin' => redirect('/admin/dashboard'),
            'developer' => redirect('/developer/dashboard'),
            'client' => redirect('/client/dashboard'),
            default => abort(403),
        };
    })->name('dashboard');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

    Route::get('/notification', [NotificationController::class, 'index'])->name('notification.index');
    Route::post('/notification/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notification.mark-as-read');
    Route::get('/notifications/unread-count', function () {
        return response()->json([
            'count' => \App\Models\Notification::where('user_id', auth()->id())->where('is_read', false)->count()
        ]);
    })->name('notifications.unread-count');

    Route::middleware(['auth'])->prefix('customer-service')->name('customer-service.')->group(function () {
        Route::get('/', fn() => Inertia::render('customer-service'))->name('index');
        Route::get('/messages', [CustomerServiceController::class, 'fetchMessages'])->name('messages');
        Route::post('/messages', [CustomerServiceController::class, 'sendMessage'])->name('send');
        Route::get('/admin-status', [CustomerServiceController::class, 'getAdminStatus'])->name('admin-status');
    });

    // ADMIN CUSTOMER SERVICE
    Route::middleware(['auth', 'role:admin'])->prefix('admin/customer-service')->name('admin.customer-service.')->group(function () {
        Route::get('/', fn() => Inertia::render('admin-customer-service'))->name('index');
        Route::get('/clients', [CustomerServiceController::class, 'fetchClients'])->name('clients');
        Route::get('/messages/{clientId}', [CustomerServiceController::class, 'fetchMessagesForClient'])->name('messages');
        Route::post('/messages/{clientId}', [CustomerServiceController::class, 'adminSendMessage'])->name('send');
    });

    Route::get('/wablas/status', [WablasController::class, 'checkStatus']);
    Route::post('/wablas/send', [WablasController::class, 'sendTestMessage']);

});


// ==============================
// ROUTE PER ROLE
// ==============================

// ADMIN ROUTES
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::resource('/users', UserController::class);
    Route::resource('bugs', AdminBugController::class)->names([
        'index' => 'bugs.index',
        'store' => 'bugs.store',
        'update' => 'bugs.update',
        'destroy' => 'bugs.destroy',
    ])->parameters([
        'bugs' => 'bug',
    ]);
    Route::resource('project', ProjectController::class)->names([
        'index' => 'projects.index',
        'store' => 'projects.store',
        'show' => 'projects.show',
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
    Route::put('/bugs/{bug}', [DeveloperBugController::class, 'update'])->name('developer.bugs.update');
    Route::get('/board', [BoardController::class, 'index'])->name('developer.board');
    Route::post('/bugs/{bug}/move', [BoardController::class, 'move'])->name('developer.bugs.move');
    Route::get('/bugs/{bug}/attachments',  [AttachmentController::class,'index'])->name('developer.attachments.index');
    Route::post('/bugs/{bug}/attachments', [AttachmentController::class,'store'])->name('developer.attachments.store');
    Route::delete('/attachments/{attachment}', [AttachmentController::class,'destroy'])->name('developer.attachments.destroy');
});

// CLIENT ROUTES
Route::middleware(['auth', 'role:client'])->prefix('client')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Client\DashboardController::class, 'index'])->name('client.dashboard');
    Route::get('/project', [\App\Http\Controllers\Client\ProjectController::class, 'index'])->name('client.project');
    Route::get('/project/{project}', [\App\Http\Controllers\Client\ProjectController::class, 'show'])->name('client.project.show');
    Route::resource('bugs', ClientBugController::class)->names([
        'index' => 'client.bugs.index',
        'store' => 'client.bugs.store',
        'update' => 'client.bugs.update',
        'destroy' => 'client.bugs.destroy',
    ])->parameters([
        'bugs' => 'bug',
    ]);
});


require __DIR__ . '/auth.php';
