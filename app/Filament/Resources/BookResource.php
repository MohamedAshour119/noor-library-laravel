<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookResource\Pages;
use App\Filament\Resources\BookResource\RelationManagers;
use App\Models\Book;
use App\Models\Category;
use App\Models\Language;
use App\Models\Option;
use Filament\Actions\Action;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Pages\SubNavigationPosition;
use Filament\Resources\Pages\Page;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;
use Locale;

function getAllLanguagesLabels()
{
    $languages = Option::where('type', 'language')->get();
    $labels = $languages->pluck('label');
    return $labels;
}
function getAllCategories()
{
    $categories = Category::all()->pluck('name');
    info('ddd', [$categories]);
    return $categories;
}

class BookResource extends Resource
{
    protected static ?string $model = Book::class;
    protected static ?string $navigationIcon = 'icon-book';
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('vendor_id', Auth::guard('vendor')->id());

    }
    public static function getPluralLabel(): ?string
    {
        return __('Dashboard.books');
    }
    public static function getNavigationGroup(): ?string
    {
        return __('Dashboard.books');
    }
    public static function getModelLabel(): string
    {
        return __('Dashboard.book');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\SpatieMediaLibraryFileUpload::make('cover')
                    ->collection('books_covers')
//                    ->responsiveImages()
                    ->required()
                    ->imageEditor()
                    ->image()
                    ->disk('public')
                    ->maxSize(5120)
                    ->imageResizeTargetWidth(182)
                    ->imageResizeTargetHeight(277)
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('title')
                    ->formatStateUsing(fn ($record) => $record ? $record->title : '')
                    ->label(__('Dashboard.title')),
                Forms\Components\Textarea::make('description')
                    ->formatStateUsing(fn ($record) => $record ? $record->description : '')
                    ->label(__('Dashboard.description')),
                Forms\Components\TextInput::make('author_name')
                    ->formatStateUsing(fn ($record) => $record ? $record->author_name : '')
                    ->label(__('Dashboard.author_of_the_book')),
                Forms\Components\TextInput::make('price')
                    ->label(__('Dashboard.price'))
                    ->numeric()
                    ->required(false)
                    ->prefix('$'),
                Forms\Components\select::make('language')
                    ->options(fn () => getAllLanguagesLabels())
                    ->formatStateUsing(function ($state) {
                        return Locale::getDisplayLanguage($state, app()->getLocale());
                    })
                    ->native(false)
                    ->prefixIcon('icon-translation')
                    ->label(__('Dashboard.language')),
                Forms\Components\Select::make('vendor_id')
                    ->disabled()
                    ->label(__('Dashboard.vendor'))
                    ->relationship('vendor', 'username'),
                Forms\Components\Select::make('category_id')
                    ->relationship('category', 'name', ignoreRecord: true)
                    ->options(fn () => getAllCategories())
                    ->selectablePlaceholder(false)
                    ->prefixIcon('icon-categories')
                    ->label(__('Dashboard.category'))
                    ->native(false)
                    ->columnSpanFull(),


                // Wrap the toggle components in a Grid to ensure they're in one row
                Forms\Components\Grid::make(3)
                ->schema([
                    Forms\Components\Toggle::make('downloadable')
                        ->label(__('Dashboard.downloadable')),
                    Forms\Components\Toggle::make('is_author')
                        ->label(__('Dashboard.is_author')),
                    Forms\Components\Toggle::make('is_free')
                        ->label(__('Dashboard.is_free')),
                ])
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
                Tables\Columns\SpatieMediaLibraryImageColumn::make('cover')
                    ->label(__('Dashboard.cover'))
                    ->width(50)
                    ->height(75)
                    ->collection('books_covers'),
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
