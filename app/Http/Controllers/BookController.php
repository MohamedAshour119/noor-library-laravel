<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\Category;
use App\Models\Rating;
use App\Models\Wishlist;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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
            return $this->response_success(['book' => $book], 'Book Retrieved Successfully.');
        }

        return $this->response_error('Book Not Found.', [], 404);
    }

    public function ratingBook(Request $request ,$id)
    {
        $validate_data = $request->validate([
            'rating' => ['required', 'numeric', 'regex:/^[0-5](\.0|\.5)?$/',]
        ]);

        $rate = $validate_data['rating'];
        $is_auth_vendor = Auth::guard('vendor')->check();

        if (!$is_auth_vendor) {
            Rating::updateOrCreate(
                [
                    'book_id' => $id,
                    'user_id' => Auth::id(),
                ],
                ['rate' => $rate]
            );
        }

        $book = Book::find($id);
        $book = new BookResource($book);

        return $this->response_success(['book' => $book], 'Rated Successfully.');
    }

    public function addBookToWishlist($book_id)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())->where('book_id', $book_id)->first();
        if ($wishlist) {
            return $this->response_error("It's already added.", [], 401);
        }
        Wishlist::create([
            'user_id' => Auth::id(),
            'book_id' => $book_id,
        ]);
        return $this->response_success([], 'Book added to wishlist successfully.');
    }
    public function deleteBookToWishlist($book_id)
    {
        $wishlist =  Wishlist::where('user_id', Auth::id())->where('book_id', $book_id)->first();
        if (!$wishlist) {
            return $this->response_error("It's not exist.", [], 404);
        }
        $wishlist->delete();
        return $this->response_success([], 'Book deleted from wishlist successfully.');
    }
}
