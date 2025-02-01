<?php

namespace App\Filament\Vendor\Resources\BookResource\Pages;

use App\Filament\Vendor\Resources\BookResource;
use App\Models\Book;
use App\Traits\GetLanguageCodeFromName;
use App\Traits\GoogleTranslation;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\Intl\Languages;

class EditBook extends EditRecord
{
    use GoogleTranslation, GetLanguageCodeFromName;
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
    protected function getTranslatedText($content)
    {
        $languages = ['en', 'ar', 'fr'];
        $translated = [];

        foreach ($content as $field => $text) {
            // Ensure that if $text is not empty, we translate it; otherwise, set an empty string.
            $translated[$field] = [];
            foreach ($languages as $language) {
                $translated[$field][$language] = $this->translateTextDynamically($text, $language);
            }
        }

        return $translated;
    }

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        Book::where('parent_id', $record->id)->delete();

        $content = [
            'title' => $data['title'],
            'description' => $data['description'],
            'author_name' => $data['author_name'],
        ];

        $language_code = $this->getLanguageCodeFromName($data['language']);
        $translated_content = $this->getTranslatedText($content);

        $revision_book = Book::create([
            'title' => $translated_content['title'],
            'description' => $translated_content['description'],
            'author_name' => $translated_content['author_name'],
            'is_free' => $data['is_free'],
            'language' => $language_code,
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
