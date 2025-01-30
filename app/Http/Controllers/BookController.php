<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddBookRequest;
use App\Http\Resources\BookResource;
use App\Http\Resources\OptionsResource;
use App\Models\Book;
use App\Models\Category;
use App\Models\Option;
use App\Models\Rating;
use App\Models\Wishlist;
use App\Traits\GoogleTranslation;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BookController extends Controller implements HasMedia
{
    use HttpResponses, InteractsWithMedia, GoogleTranslation, InteractsWithMedia;
    public function addBook(AddBookRequest $request): JsonResponse
    {
        $price = $request->filled('price') ? $request->price : null;

        // Check if the sent title is in the user's specified language or not
        $title = $request->title;
        $description = $request->description;
        $authorName = $request->author;

        // Translate the title, description, and author_name into three languages
        $translatedTitle = $this->getTranslatedText($title);
        $translatedDescription = $this->getTranslatedText($description);
        $translatedAuthorName = $this->getTranslatedText($authorName);

        // Retrieve the category based on the translated name
        $category = Category::whereJsonContains('slug->en', $request->category)->first();

        $book_exist = Book::whereJsonContains('title->' . app()->getLocale(), $request->title)->first('title');
        $book_exist_title = '';
        if ($book_exist_title) {
            $book_exist_title = $book_exist->getTranslation('title', 'en');
        }

        if ($book_exist_title === $translatedTitle['en']) {
            $message = __('AddBookValidationMessages.book_exist');
            return $this->response_error($message, [], 422);
        }

        // Create the book with translations
        $book = Book::create([
            'title' => $translatedTitle,
            'description' => $translatedDescription,
            'author_name' => $translatedAuthorName,
            'is_author' => $request->is_author,
            'is_free' => $request->is_free,
            'price' => $price,
            'language' => $request->language,
            'downloadable' => $request->downloadable,
            'vendor_id' => Auth::id(),
            'category_id' => $category->id,
            'status' => 'pending',
            'is_draft' => true,
        ]);

        // Add media files if provided
        if ($request->hasFile('cover')) {
            $book->addMediaFromRequest('cover')->toMediaCollection('books_covers');
        }
        if ($request->hasFile('book_file')) {
            $book->addMediaFromRequest('book_file')->toMediaCollection('books_files');
        }

        return $this->response_success([], __('AddBook.reviewing_book'));

    }
    private function getTranslatedText($text)
    {
        // Map the detected language to other languages
        $languages = ['en', 'ar', 'fr'];
        $translations = [];

        foreach ($languages as $language) {
            $translations[$language] = $this->translateTextDynamically($text, $language);
        }

        return $translations;
    }
    public function showBook($slug): JsonResponse
    {
        $book = Book::whereJsonContains('slug->' . app()->getLocale(), $slug)->first();


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
        $is_auth_vendor = Auth::guard('vendor_sanctum')->check();

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

    public function addBookOptions($languages = null)
    {
        $locale = app()->getLocale();

        $languages_options = Option::where('type', 'language')
            ->whereRaw("JSON_EXTRACT(label, '$.\"$locale\"') IS NOT NULL")
            ->get();
        $languages_options = OptionsResource::collection($languages_options);

        if ($languages) {
            $data = [
                'languages_options' => $languages_options,
            ];
            return $this->response_success($data, '');
        }

        $boolean_options = Option::where('type', 'boolean')
            ->whereRaw("JSON_EXTRACT(label, '$.\"$locale\"') IS NOT NULL")
            ->get();
        $boolean_options = OptionsResource::collection($boolean_options);

        $categories_options = Option::where('type', 'category')
            ->whereRaw("JSON_EXTRACT(label, '$.\"$locale\"') IS NOT NULL")
            ->get();
        $categories_options = OptionsResource::collection($categories_options);

        $data = [
            'languages_options' => $languages_options,
            'boolean_options' => $boolean_options,
            'categories_options' => $categories_options,
        ];

        return $this->response_success($data, '');
    }
}
