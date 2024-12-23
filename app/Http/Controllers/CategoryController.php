<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\Category;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    use HttpResponses;
    public function getCategories($sidebar = null): JsonResponse
    {
        $pagination_count = $sidebar ? 20 : 10;

        $categories = Category::withCount('books')->paginate($pagination_count);
        return $this->response_success($categories, 'Categories retrieved');
    }

    public function searchForCategory($keyword): JsonResponse
    {
        $categories = Category::where('name', 'like', "%{$keyword}%")
            ->withCount('books')
            ->orderBy('name', 'asc')
            ->paginate(10);
        return $this->response_success($categories, 'Categories search results retrieved');
    }

    public function getCategoryBooks($category): JsonResponse
    {
        $books = Book::paginate(3);
        $next_page_url = $books->nextPageUrl();
        $books = BookResource::collection($books);
        $data = [
            'books' =>  $books,
            'next_page_url' => $next_page_url,
            'books_count' => 20,
        ];
        return $this->response_success($data, 'Categories retrieved');
    }
}
