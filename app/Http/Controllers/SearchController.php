<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookCardResource;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Traits\HttpResponses;

class SearchController extends Controller
{
    use HttpResponses;

    public function searchBooks($keyword)
    {
        $results = Book::where('title', 'like', "%{$keyword}%")
            ->select('slug', 'title')
            ->without(['media', 'vendor', 'comments', 'category', 'ratings'])
            ->orderBy('title', 'asc')
            ->get();
        return $this->response_success(['results' => $results], 'Books search results retrieved');
    }
    public function searchBooksByKeyword($keyword)
    {
//        $results = Book::where('title', 'like', "%{$keyword}%")
//            ->without(['media', 'vendor', 'comments', 'category', 'ratings'])
//            ->orderBy('title', 'asc')
//            ->paginate(12);
        $results = Book::latest()
            ->without(['media', 'vendor', 'comments', 'category', 'ratings'])
            ->paginate(3);
        $next_page_url = $results->nextPageUrl();
        $results = BookCardResource::collection($results);

        $data = [
            'results' => $results,
            'next_page_url' => $next_page_url,
        ];

        return $this->response_success($data, 'Books search results retrieved');
    }
}
