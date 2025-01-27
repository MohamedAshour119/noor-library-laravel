<?php

namespace App\Filament\Vendor\Resources\BookResource\Pages;

use App\Filament\Vendor\Resources\BookResource;
use App\Models\Book;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditBook extends EditRecord
{
    protected static string $resource = BookResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (!key_exists('price', $data)) {
            $data['price'] = null;
        }

        return $data;
    }
    protected function getSavedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Book Updated')
            ->body(__('AddBook.reviewing_book'));
    }
    protected function handleRecordUpdate(Model $record, array $data): Model
    {

        $revisionBook = Book::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'author_name' => $data['author_name'],
            'is_free' => $data['is_free'],
            'language' => $data['language'] === 'English' ? 'en' : $data['language'],
            'price' => $data['price'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'status' => 'pending', // Set the status to pending for review
            'is_draft' => true, // Mark it as a draft
            'vendor_id' => $record->vendor_id, // Link to the same vendor
            'parent_id' => $record->id, // Link to the live book
        ]);

        return $revisionBook; // Return the draft book

    }

}
