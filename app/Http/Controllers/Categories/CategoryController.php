<?php

namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\Category;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use HttpResponses;
    public function getCategories(): JsonResponse
    {
        $categories = Category::withCount('books')->paginate(10);
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
