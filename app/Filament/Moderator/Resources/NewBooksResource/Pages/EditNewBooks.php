<?php

namespace App\Filament\Moderator\Resources\NewBooksResource\Pages;

use App\Filament\Moderator\Resources\NewBooksResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditNewBooks extends EditRecord
{
    protected static string $resource = NewBooksResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
