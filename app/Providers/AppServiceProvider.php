<?php

namespace App\Providers;

use App\Models\Vendor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
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

        Gate::define('use-translation-manager', function () {
            if (!Auth::guard('vendor_session')->check()) {
                config(['translation-manager.quick_translate_navigation_registration' => true]);
            }

            return !Auth::guard('vendor_session')->check() && !Auth::guard('user')->check();
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
        TextEntry::configureUsing(function (TextEntry $entry): void {
            $entry->extraAttributes(['style' => 'border: 2px solid #F472B6; border-radius: 0.50rem; padding: 0.25rem;']);
        });
    }
}
