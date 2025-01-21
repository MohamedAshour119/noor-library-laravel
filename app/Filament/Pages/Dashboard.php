<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Support\Enums\MaxWidth;

class Dashboard extends Page
{
    protected static ?string $navigationIcon = 'icon-book';
    protected static string $view = 'filament.pages.dashboard';
    protected static ?string $title = 'Books';
    protected ?string $subheading = 'Manage your books';
//    public function getMaxContentWidth(): MaxWidth
//    {
//        return MaxWidth::Full;
//    }
}
