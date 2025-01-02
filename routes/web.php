<?php

use App\Models\Category;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;


// routes/web.php


Route::get('/', function () {
    return view('welcome');
});

Route::get('/locale/{locale}', function ($locale) {
    if (in_array($locale, ['ar', 'en', 'fr'])) {
        session()->put('locale', $locale);

        $previousUrl = url()->previous();
        $parsedUrl = parse_url($previousUrl);

        $path = $parsedUrl['path'] ?? '/';
        preg_match('#/categories/([^/]+)#', $path, $matches);
        if (!empty($matches[1]) && session()->get('locale')) {
            $slug = urldecode($matches[1]);  // Decode the slug if necessary
            $category = Category::whereJsonContains('slug->' . app()->getLocale(), $slug)->first();
            if ($category) {
                $category_name = $category->getTranslation('slug', session()->get('locale'));
                // Replace the old slug in the URL with the new translated slug
                $newPath = str_replace($slug, $category_name, urldecode($path) );

                // Rebuild the full URL with the new path and redirect
                $newUrl = $parsedUrl['scheme'] . '://' . $parsedUrl['host'] . $newPath;
                return redirect($newUrl);
            }

        } else {
            Log::info('Slug not found in URL');
        }
    }
    return redirect()->back();
})->name('locale');

Route::view('/{any}', 'welcome')->where('any', '.*');
