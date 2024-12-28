<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Traits\HttpResponses;

class SearchController extends Controller
{
    use HttpResponses;

    public function searchBooks($keyword)
    {
//        $results = Book::where('title', 'like', "%{$keyword}%")
//            ->select('slug', 'title')
//            ->without(['media', 'vendor', 'comments', 'category', 'ratings'])
//            ->orderBy('title', 'asc')
//            ->get();
        $results = Book::latest()->take(5)
                ->select('slug', 'title')
                ->without(['media', 'vendor', 'comments', 'category', 'ratings'])
                ->get();
        return $this->response_success(['results' => $results], 'Books search results retrieved');
    }
}
