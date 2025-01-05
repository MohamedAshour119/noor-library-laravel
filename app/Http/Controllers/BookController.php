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
use Illuminate\Support\Facades\Log;
use Spatie\MediaLibrary\InteractsWithMedia;

class BookController extends Controller
{
    use HttpResponses, InteractsWithMedia, GoogleTranslation;
    public function addBook(AddBookRequest $request): JsonResponse
    {
        $price = $request->filled('price') ? $request->price : null;

        // Check if the sent title is in the user's specified language or not
        $title = $request->title;
        $description = $request->description;
        $authorName = $request->author;
        // Detect the language of the input fields (title, description, author)
        $sentLanguage = 'en';

        // Translate the title, description, and author_name into three languages
        $translatedTitle = $this->getTranslatedText($title, $sentLanguage);
        $translatedDescription = $this->getTranslatedText($description, $sentLanguage);
        $translatedAuthorName = $this->getTranslatedText($authorName, $sentLanguage);

        // Retrieve the category based on the translated name
        $category = Category::whereJsonContains('slug->' . app()->getLocale(), $request->category)->first();

        $book_exist = Book::whereJsonContains('title->' . app()->getLocale(), $request->title)->first('title');
        $book_exist_title = $book_exist->getTranslation('title', 'en');

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
        ]);

        // Add media files if provided
        if ($request->hasFile('cover')) {
            $book->addMediaFromRequest('cover')->toMediaCollection('books_covers');
        }

        if ($request->hasFile('book_file')) {
            $book->addMediaFromRequest('book_file')->toMediaCollection('books_files');
        }

        return $this->response_success([], 'We are reviewing the book within 3 days');
    }
    private function detectLanguage($title, $description, $authorName)
    {
        // Checking if Arabic characters are present in the text
        if (preg_match('/[\x{0600}-\x{06FF}]/u', $title) || preg_match('/[\x{0600}-\x{06FF}]/u', $description) || preg_match('/[\x{0600}-\x{06FF}]/u', $authorName)) {
            return 'ar';
        }

        // Checking if French characters are present in the text (simple check for French accents or words)
        if (preg_match('/[éèêôàùîï]/', $title) || preg_match('/[éèêôàùîï]/', $description) || preg_match('/[éèêôàùîï]/', $authorName)) {
            return 'fr';
        }

        // Default to English if no other language is detected
        return 'en';
    }
    private function getTranslatedText($text, $sentLanguage)
    {
        // Map the detected language to other languages
        $languages = ['en', 'ar', 'fr'];
        $translations = [];

        foreach ($languages as $language) {
            $translations[$language] = $this->translateTextDynamically($text, $language);
        }

        return $translations;
    }
    public function getBookData($slug): JsonResponse
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

    public function addBookOptions()
    {
        $locale = app()->getLocale();

        $languages_options = Option::where('type', 'language')
            ->whereRaw("JSON_EXTRACT(label, '$.\"$locale\"') IS NOT NULL")
            ->get();
        $languages_options = OptionsResource::collection($languages_options);

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
