<?php

namespace App\Providers;

use App\Services\NotificationSenderService;
use Illuminate\Foundation\Console\ServeCommand;
use Illuminate\Support\ServiceProvider;

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
        if (windows_os()) {
            // Keep essential Windows variables when the dev server is respawned.
            ServeCommand::$passthroughVariables = array_unique(array_merge(
                ServeCommand::$passthroughVariables,
                ['Path', 'SystemRoot']
            ));
        }
    }
}
