<?php

namespace App\Jobs;

use App\Models\Book;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateBookSlug implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $book;

    public function __construct(Book $book)
    {
        $this->book = $book;
    }

    public function handle()
    {
        $book = $this->book;

        if (!is_null($book->parent_id)) {
            $slugWithId = [];
            foreach ($book->slug as $lang => $slug) {
                $slugWithId[$lang] = str_replace('temp-id', $book->parent_id, $slug);
            }
            $book->slug = $slugWithId;
            $book->saveQuietly();
        } else {
            $slugWithId = [];
            foreach ($book->slug as $lang => $slug) {
                $slugWithId[$lang] = str_replace('temp-id', $book->id, $slug);
            }
            $book->slug = $slugWithId;
            $book->saveQuietly();
        }
    }
}
