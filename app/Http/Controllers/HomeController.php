<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookCardResource;
use App\Models\Book;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class HomeController extends Controller
{
    use HttpResponses;
    public function getBooks()
    {
//        sleep(100000);
        $books = Book::where('is_draft', false)
            ->where('status', 'approved')
            ->with('category')
            ->paginate(10);
        $next_page_url = $books->nextPageUrl();
        $books = BookCardResource::collection($books);
        $data = [
            'books' => $books,
            'next_page_url' => $next_page_url,
        ];
        return $this->response_success($data, 'Fetch Home Books.');
    }
    public function getTranslation($namespace)
    {
        // Decode URL-encoded namespace
        $decodedNamespace = urldecode($namespace);
        $translationsConfig = config('translations');

//        $static_namespaces = [];

        if (array_key_exists($decodedNamespace, $translationsConfig['static'])) {
            // Static translation namespace
            $namespace = $translationsConfig['static'][$decodedNamespace];
        } else {
            foreach ($translationsConfig['dynamic'] as $prefix => $pattern) {
                // Check if the namespace matches the dynamic pattern
                Log::info('$prefix', [$prefix]);
                if (Str::startsWith($decodedNamespace, $prefix)) {
                    // Use preg_match to extract the dynamic part of the namespace
                    preg_match("/$prefix\_(.*)$/", $decodedNamespace, $matches);

                    if (isset($matches[1])) {
                        // Replace the dynamic part (e.g., {slug} with the actual value)
                        $namespace = 'Show' . ucfirst($prefix);
//                        array_push($static_namespaces, $namespace);
                    }
                    break;
                }
            }
        }

        if (!$namespace) {
            return $this->response_error('Invalid namespace', [], 404);
        }
        // Get the current page translations, ensure it's an array
        $translations_current_page = (array) Lang::get($namespace);
        // Get the header translations, ensure it's an array (for common header translations)
        $translations_header = (array) Lang::get('Header'); // Assuming you have a file named 'Header.php'

        // Merge all translations together (current page, common, and header)
        $translations = array_merge($translations_current_page, $translations_header);

        return $this->response_success($translations, 'Translation text.');
    }

    public function getSectionBooks($section)
    {
        if ($section === 'highest_rated') {
            $books = Book::query()
                ->where('is_draft', false)
                ->where('status', 'approved')
                ->with('category') // Eager load relationships
                ->leftJoin('ratings', 'books.id', '=', 'ratings.book_id') // Join ratings table
                ->select('books.id', 'books.title', 'books.price', 'books.is_free', 'books.slug', 'books.author_name', 'books.vendor_id', 'books.category_id') // Specify columns explicitly
                ->selectRaw('ROUND(AVG(ratings.rate), 2) as average_rating_value') // Use a different alias
                ->selectRaw('COUNT(ratings.id) as ratings_count') // Calculate ratings count
                ->groupBy('books.id', 'books.title', 'books.price', 'books.is_free', 'books.slug', 'books.author_name', 'books.vendor_id', 'books.category_id') // Group by all selected columns
                ->orderBy('average_rating_value', 'desc') // Order by average rating
                ->paginate(10);
        } else if ($section === 'popular_books') {
            $books = Book::query()
                ->where('is_draft', false)
                ->where('status', 'approved')
                ->with('category') // Eager load relationships
                ->leftJoin('ratings', 'books.id', '=', 'ratings.book_id') // Join ratings table
                ->select('books.id', 'books.title', 'books.price', 'books.is_free', 'books.slug', 'books.author_name', 'books.vendor_id', 'books.category_id') // Specify columns explicitly
                ->selectRaw('ROUND(AVG(ratings.rate), 2) as average_rating_value') // Use a different alias
                ->selectRaw('COUNT(ratings.id) as ratings_count') // Calculate ratings count
                ->groupBy('books.id', 'books.title', 'books.price', 'books.is_free', 'books.slug', 'books.author_name', 'books.vendor_id', 'books.category_id') // Group by all selected columns
                ->orderBy('ratings_count', 'desc') // Order by ratings count
                ->paginate(10);
        } else {
            $books = Book::where('is_draft', false)
                ->where('status', 'approved')
                ->with('category')
                ->orderBy('created_at', 'desc')
                ->paginate(10);
        }

        $next_page_url = $books->nextPageUrl();
        $books = BookCardResource::collection($books);

        $data = [
            'books' => $books,
            'next_page_url' => $next_page_url,
        ];
        return $this->response_success($data, 'Fetch Home Books.');
    }



}
