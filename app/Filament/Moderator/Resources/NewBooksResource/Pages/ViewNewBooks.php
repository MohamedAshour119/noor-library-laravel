<?php

namespace App\Filament\Moderator\Resources\NewBooksResource\Pages;

use App\Filament\Moderator\Resources\ChangesResource;
use App\Filament\Moderator\Resources\NewBooksResource;
use Filament\Actions;
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

class ViewNewBooks extends ViewRecord
{
    protected static string $resource = NewBooksResource::class;

    public function approveAddNewBook()
    {
        $this->record->update([
            'status' => 'approved',
            'is_draft' => false,
        ]);
        $this->redirect($this->getResource()::getUrl('index'));
        Notification::make()
            ->title(__('Dashboard.book_approved'))
            ->success()
            ->send();
    }
    public function rejectAddNewBook()
    {
        $this->record->delete();
        $this->redirect($this->getResource()::getUrl('index'));

        Notification::make()
            ->title(__('Dashboard.book_rejected_deleted'))
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
                                ->state(fn ($record) => $record->getFirstMedia('books_covers')->getUrl())
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
                                        ->fileUrl(fn ($record) => $record->getFirstMedia('books_files')?->getUrl())
                                        ->label(__('Dashboard.book_content'))
                                        ->columnSpanFull(),
                                ])
                                ->columnSpan(2),

                            Grid::make(1)
                                ->schema([
                                    Grid::make(2)
                                        ->schema([
                                            ViewEntry::make('approve_button')
                                                ->view('filament.moderator.components.approve-button')
                                                ->columnSpan(1),
                                            ViewEntry::make('reject_button')
                                                ->view('filament.moderator.components.reject-button')
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
