<?php

namespace App\Filament\Vendor\Resources\BookResource\Pages;

use App\Filament\Vendor\Resources\BookResource;
use App\Models\Book;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class ListBooks extends ListRecords
{
    protected static string $resource = BookResource::class;
    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
    public function getSubheading(): string|Htmlable|null
    {
        return __('users.manage_books');
    }

    public function getTabs(): array
    {
        $vendor_id = Auth::guard('vendor_session')->id();
        return [
            'all' => Tab::make(__('Dashboard.all'))
                ->icon('icon-all')
                ->badge(Book::query()->where('vendor_id', $vendor_id)->where('is_draft', false)->count()),
            'free' => Tab::make(__('Dashboard.free'))
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_free', true))
                ->icon('icon-free')
                ->badge(Book::query()->where('vendor_id', $vendor_id)->where('is_draft', false)->where('is_free', true)->count()),
            'paid' => Tab::make(__('Dashboard.paid'))
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_free', false))
                ->icon('icon-paid')
                ->badge(Book::query()->where('vendor_id', $vendor_id)->where('is_draft', false)->where('is_free', false)->count()),
        ];
    }
}
