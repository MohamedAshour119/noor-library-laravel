<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $bookFile = $this->getMedia('books_files')->first();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'is_author' => $this->is_author === 1,
            'language' => $this->language,
            'author' => $this->author_name,
            'downloadable' => $this->downloadable === 1,
            'created_at' => $this->created_at?->format('d-m-Y'),
            'size' => $bookFile ? round($bookFile->size / 1024 / 1024, 2) : null, // Book size in MB
            'cover' => $this->getMedia('books_covers')->first()?->getUrl() ?? '',
            'book_file' => $this->getMedia('books_files')->first()?->getUrl() ?? '',
            'vendor' => new VendorResource($this->vendor),
            'category' => new CategoryResource($this->category),
        ];
    }
}
