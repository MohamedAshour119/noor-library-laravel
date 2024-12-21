<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\Category;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\InteractsWithMedia;

class BookController extends Controller
{
    use HttpResponses, InteractsWithMedia;
    public function addBook(AddBookRequest $request): JsonResponse
    {
        $price = $request->filled('price') ? $request->price : null;
        $category = Category::where('name', $request->category)->first('id');

        $book = Book::create([
            'title' => $request->title,
            'description' => $request->description,
            'is_author' => $request->is_author,
            'author_name' => $request->author,
            'is_free' => $request->is_free,
            'price' => $price,
            'language' => $request->language,
            'downloadable' => $request->downloadable,
            'vendor_id' => Auth::id(),
            'category_id' => $category->id,
            'status' => 'pending',
        ]);

        if ($request->hasFile('cover')) {
            $book->addMediaFromRequest('cover')->toMediaCollection('books_covers');
        }

        if ($request->hasFile('book_file')) {
            $book->addMediaFromRequest('book_file')->toMediaCollection('books_files');
        }

        return $this->response_success([], 'We are reviewing the book within 3 days');
    }

    public function getBookData($slug): JsonResponse
    {
        $book = Book::where('slug', $slug)->first();
        if ($book) {
            $book = new BookResource($book);

            $data = [
                'book' => $book
            ];
            return $this->response_success($data, 'Book Retrieved Successfully.');
        }
        return $this->response_error('Book Not Found.', [], 404);
    }
}
