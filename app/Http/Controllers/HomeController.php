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
        $books = Book::paginate(10);
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

        if (array_key_exists($decodedNamespace, $translationsConfig['static'])) {
            // Static translation namespace
            $namespace = $translationsConfig['static'][$decodedNamespace];
        } else {
            foreach ($translationsConfig['dynamic'] as $prefix => $pattern) {
                // Check if the namespace matches the dynamic pattern
                if (Str::startsWith($decodedNamespace, $prefix)) {
                    // Use preg_match to extract the dynamic part of the namespace
                    preg_match("/$prefix-(.*)$/", $decodedNamespace, $matches);
                    if (isset($matches[1])) {
                        // Replace the dynamic part (e.g., {slug} with the actual value)
                        $namespace = str_replace('{slug}', $matches[1], $pattern);
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

        // Get the common translations, ensure it's an array (for common translations across all pages)
        $translations_common = (array) Lang::get('Common'); // Optional common translations

        // Get the header translations, ensure it's an array (for common header translations)
        $translations_header = (array) Lang::get('Header'); // Assuming you have a file named 'Header.php'

        // Merge all translations together (current page, common, and header)
        $translations = array_merge($translations_current_page, $translations_common, $translations_header);

        return $this->response_success($translations, 'Translation text.');
    }






//    public function getHomeTranslationText($namespace)
//    {
//        $decodedNamespace = urldecode($namespace);
//        dd($decodedNamespace);
//        $translations_current_page = Lang::get($namespace);
//        $translations_common = Lang::get('Home');
//        $translations = array_merge($translations_current_page, $translations_common);
//        return $this->response_success($translations, 'Translation text.');
//    }
}
