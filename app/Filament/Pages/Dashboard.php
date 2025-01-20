<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;

class Dashboard extends Page
{
    protected static ?string $navigationIcon = 'icon-book';
    protected static string $view = 'filament.pages.dashboard';
    protected static ?string $title = 'Books';
}
