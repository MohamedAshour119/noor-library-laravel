<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookCardResource;
use App\Models\Book;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;

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

    public function getHomeTranslationText($namespace)
    {
        $translations_current_page = Lang::get($namespace);
        $translations_common = Lang::get('Home');
        $translations = array_merge($translations_current_page, $translations_common);
        return $this->response_success($translations, 'Translation text.');
    }
}
