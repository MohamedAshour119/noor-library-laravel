<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookCardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $vendor = $this->vendor;
        $locale = app()->getLocale();
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->getTranslation('slug', $locale),
            'author' => $this->getTranslation('author_name', $locale),
            'price' => (int) $this->price,
            'is_free' => $this->is_free === 1,
            'cover' => $this->getMedia('books_covers')->first()?->getUrl() ?? '',
            'average_ratings' => $this->average_rating(),
            'ratings_count' => $this->ratings_count,
            'vendor' => [
                'first_name' => $vendor->first_name,
                'last_name' => $vendor->last_name,
                'username' => $vendor->username,
            ],
        ];
    }
}
