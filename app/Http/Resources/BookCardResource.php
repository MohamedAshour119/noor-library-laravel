<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class BookCardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $is_added_to_wishlist = '';
        if (Auth::guard('user')->check()) $is_added_to_wishlist = Auth::user()->wishlists()->where('book_id', $this->id)->exists();

        $vendor = $this->vendor;
        $locale = app()->getLocale();
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->getTranslation('slug', $locale),
            'author' => $this->getTranslation('author_name', $locale),
            'price' => (int) $this->price,
            'category' => $this->category?->getTranslation('name', $locale) ?? '',
            'is_free' => $this->is_free === 1,
            'cover' => $this->getMedia('books_covers')->first()?->getUrl() ?? '',
            'average_ratings' => $this->average_rating(),
            'ratings_count' => $this->ratings_count,
            'is_added_to_wishlist' => $is_added_to_wishlist,
            'vendor' => [
                'first_name' => $vendor->first_name,
                'last_name' => $vendor->last_name,
                'username' => $vendor->username,
            ],
        ];
    }
}
