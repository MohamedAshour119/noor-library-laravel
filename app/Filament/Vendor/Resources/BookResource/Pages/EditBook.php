<?php

namespace App\Filament\Vendor\Resources\BookResource\Pages;

use App\Filament\Vendor\Resources\BookResource;
use App\Models\Book;
use App\Traits\GoogleTranslation;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditBook extends EditRecord
{
    use GoogleTranslation;
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
    protected function getTranslatedText($text)
    {
        $languages = ['en', 'ar', 'fr'];
        $translations = [];

        foreach ($languages as $language) {
            $translations[$language] = $this->translateTextDynamically($text, $language);
        }

        return $translations;
    }
    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $exist_revision_book = Book::where('parent_id', $record->id)->first();
        if ($exist_revision_book && $exist_revision_book->exists()) {
            $exist_revision_book->delete();
        }

        $translated_title = $record->title = $this->getTranslatedText($record->title);
        $translated_description = $record->description = $this->getTranslatedText($record->description);
        $translated_author_name = $record->author_name = $this->getTranslatedText($record->author_name);

        $revision_book = Book::create([
            'title' => $translated_title,
            'description' => $translated_description,
            'author_name' => $translated_author_name,
            'is_free' => $data['is_free'],
            'language' => $data['language'] === 'English' ? 'en' : $data['language'],
            'price' => $data['price'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'status' => 'pending',
            'is_draft' => true,
            'vendor_id' => $record->vendor_id,
            'parent_id' => $record->id,
        ]);

        return $revision_book; // Return the draft book

    }

}
