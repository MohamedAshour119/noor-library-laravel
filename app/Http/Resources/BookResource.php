<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;
use setasign\Fpdi\Fpdi;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return int
     */
    private function getPdfPageCount(Media $media)
    {
        $pdf_path = $media->getPath();
        $pdf = new Fpdi();
        $pdf_count = $pdf->setSourceFile($pdf_path);

        return $pdf_count;
    }
    public function toArray(Request $request): array
    {
        $book_file = $this->getMedia('books_files')->first();
        $pages_count = $book_file ? $this->getPdfPageCount($book_file) : null;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'is_author' => $this->is_author === 1,
            'language' => $this->language,
            'author' => $this->author_name,
            'downloadable' => $this->downloadable === 1,
            'price' => (int) $this->price,
            'created_at' => $this->created_at?->format('d-m-Y'),
            'size' => $book_file ? round($book_file->size / 1024 / 1024, 2) : null, // Book size in MB
            'comments_count' => $this->comments_count,
            'ratings' => $this->sum_ratings_values(),
            'ratings_count' => $this->ratings_count,
            'average' => $this->average_rating(),
            'your_rate' => $this->user_rate(),
            'pages_count' => $pages_count,
            'cover' => $this->getMedia('books_covers')->first()?->getUrl() ?? '',
            'book_file' => $this->getMedia('books_files')->first()?->getUrl() ?? '',
            'vendor' => new VendorResource($this->vendor),
            'category' => new CategoryResource($this->category),
        ];
    }
}
