<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookCardResource;
use App\Http\Resources\BookResource;
use App\Models\User;
use App\Models\Wishlist;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    use HttpResponses;
    public function addBookToWishlist($book_id)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())->where('book_id', $book_id)->first();
        if ($wishlist) {
            return $this->response_error("It's already added.", [], 403);
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
    public function getWishlistBooks($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return $this->response_error('User not found', [], 404);
        }
        $wishlist_books_query = $user->wishlistedBooks(); // Returns a query builder
        $wishlist_books = $wishlist_books_query->paginate(18);

        // Transform the paginated result using the resource
        $wishlist_books_transformed = BookCardResource::collection($wishlist_books->items());

        $data = [
            'wishlist_books' => $wishlist_books_transformed,
            'wishlist_books_next_page_url' => $wishlist_books->nextPageUrl(),
        ];
        return $this->response_success($data, 'Wishlists Books');
    }
}
