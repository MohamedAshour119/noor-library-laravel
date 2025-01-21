<?php

namespace App\Providers;

use App\Models\Vendor;
use Filament\Support\Facades\FilamentIcon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        FilamentIcon::register([
//            'panels::pages.dashboard.navigation-item' => 'icon-book',
        ]);
        Gate::define('use-translation-manager', function (?Vendor $vendor) {
            // Your authorization logic
            return Auth::guard('vendor')->check();
        });
    }
}
