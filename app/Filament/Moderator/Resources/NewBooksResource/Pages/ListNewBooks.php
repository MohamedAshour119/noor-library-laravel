<?php

namespace App\Filament\Moderator\Resources\NewBooksResource\Pages;

use App\Filament\Moderator\Resources\NewBooksResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Contracts\Support\Htmlable;

class ListNewBooks extends ListRecords
{
    protected static string $resource = NewBooksResource::class;

    protected function getHeaderActions(): array
    {
        return [
//            Actions\CreateAction::make(),
        ];
    }
    public function getSubheading(): string|Htmlable|null
    {
        return __('Dashboard.review_new_books');
    }
}
