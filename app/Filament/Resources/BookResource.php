<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookResource\Pages;
use App\Filament\Resources\BookResource\RelationManagers;
use App\Models\Book;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class BookResource extends Resource
{
    protected static ?string $model = Book::class;

    protected static ?string $navigationIcon = 'icon-book';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title'),
                Forms\Components\TextInput::make('slug')
                    ->required(),
                Forms\Components\TextInput::make('description')
                    ->required(),
                Forms\Components\Toggle::make('is_author')
                    ->required(),
                Forms\Components\TextInput::make('author_name')
                    ->required(),
                Forms\Components\Toggle::make('is_free')
                    ->required(),
                Forms\Components\TextInput::make('price')
                    ->numeric()
                    ->prefix('$'),
                Forms\Components\TextInput::make('language')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Toggle::make('downloadable')
                    ->required(),
                Forms\Components\Select::make('vendor_id')
                    ->relationship('vendor', 'id')
                    ->required(),
                Forms\Components\Select::make('category_id')
                    ->relationship('category', 'name'),
                Forms\Components\TextInput::make('unique_key')
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id'),
                Tables\Columns\ImageColumn::make('image')
                    ->label('Image')
                    ->getStateUsing(function (Book $record) {
                        return $record->hasMedia('books_covers')
                            ? $record->getFirstMediaUrl('books_covers')
                            : null;
                    }),
                Tables\Columns\TextColumn::make('price')
                    ->money()
                    ->sortable(),
                Tables\Columns\TextColumn::make('language')
                    ->searchable(),
                Tables\Columns\IconColumn::make('downloadable')
                    ->boolean(),
                Tables\Columns\TextColumn::make('vendor.username')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status'),
                Tables\Columns\IconColumn::make('is_author')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_free')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListBooks::route('/'),
            'create' => Pages\CreateBook::route('/create'),
            'edit' => Pages\EditBook::route('/{record}/edit'),
        ];
    }
}
