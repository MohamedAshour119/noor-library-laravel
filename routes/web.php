<?php

use App\Http\Controllers\SocialController;
use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;


// routes/web.php


Route::get('/', function () {
    return view('welcome');
});
Route::middleware(['cors'])->group(function () {
    Route::get('/auth/google/redirect', [SocialController::class, 'googleRedirect']);
    Route::get('/auth/google/callback', [SocialController::class, 'googleCallback']);
});
Route::get('/locale/{locale}', function ($locale) {
    if (in_array($locale, ['ar', 'en', 'fr'])) {
        session()->put('locale', $locale);

        $previousUrl = url()->previous();
        $parsedUrl = parse_url($previousUrl);
        $path = $parsedUrl['path'] ?? '/';
        $patterns = [
            'categories' => '/categories/([^/]+)',
            'books' => '/books/([^/]+)',
            'users' => '/users/([^/]+)',
            // Add more routes here as needed
        ];
        // Iterate through the patterns and check if the path matches any of them
        foreach ($patterns as $route => $pattern) {
            if (preg_match('#' . $pattern . '#', $path, $matches)) {
                $slug = urldecode($matches[1]);  // Decode the slug if necessary

                // Handle the category, book, or user slug lookup
                switch ($route) {
                    case 'categories':
                        $model = Category::class;
                        $slugField = 'slug';
                        break;
                    case 'books':
                        $model = Book::class; // Assuming Book model exists
                        $slugField = 'slug';
                        break;
                    case 'users':
                        $model = User::class; // Assuming User model exists
                        $slugField = 'username'; // Use 'username' for users
                        break;
                    // Add cases for more routes as needed
                    default:
                        return redirect()->back();
                }

                // Lookup the model by the slug (translated if necessary)
                if ($slugField === 'username') {
                    $modelInstance = $model::where("{$slugField}", $slug)->first();
                }else {
                    $modelInstance = $model::whereJsonContains("{$slugField}->" . app()->getLocale(), $slug)->first();
                }

                if ($modelInstance) {
                    if ($slugField !== 'username') {
                        $newSlug = $modelInstance->getTranslation($slugField, $locale);

                        // Replace the old slug in the URL with the new translated slug
                        $newPath = str_replace($slug, $newSlug, urldecode($path));

                        // Rebuild the full URL with the new path and redirect
                        $newUrl = $parsedUrl['scheme'] . '://' . $parsedUrl['host'] . $newPath;
                        return redirect($newUrl);
                    }
                }

            }
        }
    }
    return redirect()->back();
})->name('locale');

Route::view('/{any}', 'welcome')->where('any', '.*');
