<?php

namespace App\Filament\Moderator\Resources\ChangesResource\Pages;

use App\Filament\Moderator\Resources\ChangesResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Contracts\Support\Htmlable;

class ListChanges extends ListRecords
{
    protected static string $resource = ChangesResource::class;

    protected function getHeaderActions(): array
    {
        return [
//            Actions\CreateAction::make(),
        ];
    }
    public function getSubheading(): string|Htmlable|null
    {
        return __('Dashboard.review_books_changes');
    }
}
