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
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'is_author' => $this->is_author === 1,
            'language' => $this->language,
            'author' => $this->author_name,
            'category' => $this->category,
            'downloadable' => $this->downloadable === 1,
            'cover' => $this->getFirstMedia('books_covers')?->getUrl() ?? '',
            'book_file' => $this->getFirstMedia('books_files')?->getUrl() ?? '',
//            'user' => $this->user,
        ];
    }
}
