<?php

namespace App\Filament\Moderator\Resources\ChangesResource\Pages;

use App\Filament\Moderator\Resources\ChangesResource;
use App\Traits\GetLanguageCodeFromName;
use App\Traits\GoogleTranslation;
use App\Traits\GoogleTranslationSlug;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ViewEntry;
use Filament\Infolists\Infolist;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;
use Joaopaulolndev\FilamentPdfViewer\Infolists\Components\PdfViewerEntry;
use Locale;

class ViewChanges extends ViewRecord
{
    use GoogleTranslationSlug, GoogleTranslation, GetLanguageCodeFromName;
    protected static string $resource = ChangesResource::class;

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
    private function getTranslatedTextSlug($text, $sentLanguage, $id)
    {
        $languages = ['en', 'ar', 'fr'];
        $translations = [];

        foreach ($languages as $language) {
            $translations[$language] = $this->translateTextDynamicallySlug($text, $sentLanguage, $language, $id);
        }

        return $translations;
    }
    public function approveChanges()
    {
        $book = $this->record->parent_book;

        $content = [
            'title' => $this->record->title,
            'description' => $this->record->description,
            'author_name' => $this->record->author_name,
        ];

        $translated_content = $this->getTranslatedText($content);
        $translated_slug = $this->getTranslatedTextSlug($this->record->title, 'en', $book->id);

        // Update translatable fields from changes
        $book->fill([
            'title' => $translated_content['title'],
            'description' => $translated_content['description'],
            'author_name' => $translated_content['author_name'],
        ]);

        // Update non-translatable fields
        $book->fill([
            'is_author' => $this->record->is_author,
            'is_free' => $this->record->is_free,
            'price' => $this->record->price,
            'downloadable' => $this->record->downloadable,
            'language' => $this->record->language,
            'category_id' => $this->record->category_id,
            'updated_at' => now(),
        ]);

        $book->slug = $translated_slug;
        $book->save();

        // Update changes record status
        $this->record->update(['status' => 'approved']);

        // Redirect with notification
        $this->redirect($this->getResource()::getUrl('index'));
        Notification::make()
            ->title(__('Dashboard.changes_approved'))
            ->success()
            ->send();
    }
    public function rejectChanges()
    {
        $this->record->delete();
        $this->redirect($this->getResource()::getUrl('index'));

        Notification::make()
            ->title(__('Dashboard.changes_rejected_deleted'))
            ->danger()
            ->send();
    }

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            Section::make('Book changes info')
                ->schema([
                    Grid::make(3)
                        ->schema([
                            ImageEntry::make('cover')
                                ->state(function ($record) {
                                    $media = $record->parent_book->getFirstMedia('books_covers');
                                    return $media ? $media->getUrl() : null;
                                })
                                ->placeholder(__('Dashboard.cover'))
                                ->width(152)
                                ->height(247)
                                ->label(__('Dashboard.cover'))
                                ->columnSpan(1),

                            Grid::make(2)
                                ->schema([
                                    TextEntry::make('Title')
                                        ->state(fn ($record) => $record->title)
                                        ->placeholder(__('Dashboard.title'))
                                        ->label(__('Dashboard.title')),
                                    TextEntry::make('Description')
                                        ->state(fn ($record) => $record->description)
                                        ->placeholder(__('Dashboard.description'))
                                        ->label(__('Dashboard.description')),
                                    TextEntry::make('Language')
                                        ->state(function ($record) {
                                            return Locale::getDisplayLanguage($record->language, app()->getLocale());
                                        })
                                        ->label(__('Dashboard.language')),
                                    TextEntry::make('Author Name')
                                        ->state(function ($record) {
                                            return $record->author_name;
                                        })
                                        ->label(__('Dashboard.author_of_the_book')),
                                    TextEntry::make('category')
                                        ->state(fn ($record) => $record->category->name)
                                        ->label(__('Dashboard.category')),
                                    TextEntry::make('is_author')
                                        ->state(fn ($record) => $record->is_author ? 'true' : 'false')
                                        ->label(__('Dashboard.is_author')),
                                    TextEntry::make('is_free')
                                        ->state(fn ($record) => $record->is_free ? 'true' : 'false')
                                        ->label(__('Dashboard.is_free')),
                                    TextEntry::make('price')
                                        ->state(fn ($record) => $record->is_free ? 'null' : $record->price)
                                        ->label(__('Dashboard.price')),
                                    TextEntry::make('downloadable')
                                        ->state(fn ($record) => $record->downloadable ? 'true' : 'false')
                                        ->label(__('Dashboard.downloadable'))
                                        ->columnSpanFull(),
                                    PdfViewerEntry::make('pdf_viewer')
                                        ->fileUrl(fn ($record) => $record->parent_book->getFirstMedia('books_files')?->getUrl())
                                        ->label(__('Dashboard.book_content'))
                                        ->columnSpanFull(),
                                ])
                                ->columnSpan(2),

                            Grid::make(1)
                                ->schema([
                                    Grid::make(2)
                                        ->schema([
                                            ViewEntry::make('approve_button')
                                                ->view('filament.moderator.components.approve-changes-button')
                                                ->columnSpan(1),
                                            ViewEntry::make('reject_button')
                                                ->view('filament.moderator.components.reject-changes-button')
                                                ->columnSpan(1),
                                        ])
                                        ->extraAttributes(['class' => 'justify-center gap-4'])
                                ])
                                ->columnSpanFull()
                                ->extraAttributes(['class' => 'text-center'])


                        ])
                ]),
        ]);
    }
}
