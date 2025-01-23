<?php

namespace App\Providers;

use App\Models\Vendor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
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

        TextInput::configureUsing(function (TextInput $textInput) {
            $textInput->required();
            $textInput->autocomplete();
        });
        Select::configureUsing(function (Select $select) {
            $select->required();
            $select->searchable();
            $select->preload();
            $select->selectablePlaceholder(false);
        });
    }
}
