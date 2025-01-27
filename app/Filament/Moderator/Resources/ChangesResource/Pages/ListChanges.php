<?php

namespace App\Filament\Moderator\Resources\ChangesResource\Pages;

use App\Filament\Moderator\Resources\ChangesResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListChanges extends ListRecords
{
    protected static string $resource = ChangesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
