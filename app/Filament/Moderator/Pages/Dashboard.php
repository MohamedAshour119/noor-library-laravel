<?php

namespace App\Filament\Moderator\Pages;

class Dashboard extends \Filament\Pages\Dashboard
{
    protected static string $routePath = 'moderator/dashboard';
    protected static ?string $title = 'Admin Dashboard';
    protected static ?string $navigationIcon = 'icon-book';
//    protected static string $view = 'filament.pages.dashboard';
    protected static bool $isDiscovered = true;

}
