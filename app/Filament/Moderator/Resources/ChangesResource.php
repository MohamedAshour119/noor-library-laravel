<?php

namespace App\Filament\Moderator\Resources;

use App\Filament\Moderator\Resources\ChangesResource\Pages;
use App\Filament\Moderator\Resources\ChangesResource\RelationManagers;
use App\Models\Book;
use App\Models\Changes;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Locale;

class ChangesResource extends Resource
{
    protected static ?string $model = Book::class;
    protected static ?string $navigationIcon = 'icon-book';
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('is_draft', true)
            ->where('status', 'pending');
    }
    public static function getLabel(): ?string
    {
        return __('Dashboard.books_changes');
    }
    public static function getPluralLabel(): ?string
    {
        return __('Dashboard.books_changes');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label(__('Dashboard.id')),
                Tables\Columns\TextColumn::make('title')
                    ->label(__('Dashboard.title')),
                Tables\Columns\ImageColumn::make('cover')
                    ->label('Cover')
                    ->getStateUsing(function ($record) {
                        // Check if the book has a parent book, otherwise load the current book's media
                        $parent = $record->parent_book;
                        return $parent ? $parent->getFirstMediaUrl('books_covers') : $record->getFirstMediaUrl('books_covers');
                    })
                    ->width(50)
                    ->height(75)
                    ->disk('public'),  // You can specify the disk where the images are stored
                Tables\Columns\TextColumn::make('price')
                    ->label(__('Dashboard.price'))
                    ->formatStateUsing(fn ($state) => $state . ' ' . __('Dashboard.usd'))
                    ->sortable(),
                Tables\Columns\TextColumn::make('language')
                    ->label(__('Dashboard.language'))
                    ->getStateUsing(function (Book $record) {
                        return Locale::getDisplayLanguage($record->language,  app()->getLocale());
                    })
                    ->searchable(),
                Tables\Columns\IconColumn::make('downloadable')
                    ->label(__('Dashboard.downloadable'))
                    ->boolean(),
                Tables\Columns\TextColumn::make('vendor.username')
                    ->label(__('Dashboard.vendor'))
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->label(__('Dashboard.category'))
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label(__('Dashboard.status')),
                Tables\Columns\IconColumn::make('is_author')
                    ->label(__('Dashboard.is_author'))
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_free')
                    ->label(__('Dashboard.is_free'))
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Dashboard.created_at'))
                    ->dateTime('Y-d-m')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label(__('Dashboard.updated_at'))
                    ->dateTime('Y-d-m')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
//                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListChanges::route('/'),
//            'create' => Pages\CreateChanges::route('/create'),
            'edit' => Pages\EditChanges::route('/{record}/edit'),
        ];
    }
}
