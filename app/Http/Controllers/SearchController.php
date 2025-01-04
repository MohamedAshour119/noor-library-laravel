<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookCardResource;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{
    use HttpResponses;

    public function searchBooks($keyword)
    {
        $locale = app()->getLocale();  // Get the current locale

        // Search the 'title' and 'slug' using the locale-specific value
        $results = Book::where(function($query) use ($keyword, $locale) {
            $query->where('title', 'like', "%{$keyword}%")
                ->orWhere('slug', 'like', "%{$keyword}%");
        })
            ->select('slug', 'title')
            ->without(['media', 'vendor', 'comments', 'category', 'ratings'])
            ->limit(6)
            ->orderBy('title', 'asc')
            ->get();

        // Log the initial results to debug
        Log::info('====================');
        Log::info('$results', [$results]);

        // Get the translations based on the current locale
        $results = $results->map(function($book) use ($locale) {
            // Get the localized 'slug' and 'title' based on the current locale
            $localizedSlug = $book->getTranslation('slug', $locale);  // Get localized slug
            $localizedTitle = $book->getTranslation('title', $locale);  // Get localized title

            // Return a transformed book with only the localized fields
            return [
                'slug' => $localizedSlug,
                'title' => $localizedTitle,
            ];
        });

        return $this->response_success(['results' => $results], 'Books search results retrieved');
    }

    public function searchBooksByKeyword($keyword)
    {
        // Search for books based on title, and include pagination
        $results = Book::where(function($query) use ($keyword) {
            $query->where('title', 'like', "%{$keyword}%")
                ->orWhere('slug', 'like', "%{$keyword}%");
        })
            ->without(['media', 'vendor', 'comments', 'category', 'ratings'])
            ->orderBy('title', 'asc')
            ->paginate(12);

        // Get the next page URL from the paginator
        $next_page_url = $results->nextPageUrl();

        // Transform the paginated result into the BookCardResource collection
        $results = BookCardResource::collection($results);

        // Prepare the data response with pagination info
        $data = [
            'results' => $results,
            'next_page_url' => $next_page_url,
        ];

        return $this->response_success($data, 'Books search results retrieved');
    }

}
