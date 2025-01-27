<?php

namespace App\Filament\Moderator\Resources\ChangesResource\Pages;

use App\Filament\Moderator\Resources\ChangesResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditChanges extends EditRecord
{
    protected static string $resource = ChangesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
