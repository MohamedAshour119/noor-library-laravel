<?php

namespace App\Http\Controllers\Vendors;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddBookRequest;
use App\Models\Book;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\InteractsWithMedia;

class AddBookController extends Controller
{
    use HttpResponses, InteractsWithMedia;
    public function addBook(AddBookRequest $request): JsonResponse
    {
        $price = $request->filled('price') ? $request->price : null;
        // Create and save the book record
        $book = Book::create([
            'title' => $request->title,
            'description' => $request->description,
            'is_author' => $request->is_author,
            'author_name' => $request->author,
            'is_free' => $request->is_free,
            'price' => $price,
            'language' => $request->language,
            'category' => $request->category,
            'downloadable' => $request->downloadable,
            'vendor_id' => Auth::id(),
            'status' => 'pending',
        ]);

        // Add media files if they exist
        if ($request->hasFile('cover')) {
            $book->addMediaFromRequest('cover')->toMediaCollection('books_covers');
        }

        if ($request->hasFile('book_file')) {
            $book->addMediaFromRequest('book_file')->toMediaCollection('books_files');
        }

        return $this->response_success([], 'We are reviewing the book within 3 days');
    }
}
