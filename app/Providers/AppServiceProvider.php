<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\NotificationSenderService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
         $this->app->singleton(NotificationSenderService::class, function ($app) {
            return new NotificationSenderService($app->make(\App\Services\WablasService::class));
    });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
