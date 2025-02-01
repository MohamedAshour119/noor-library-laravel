<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookCardResource;
use App\Http\Resources\BookResource;
use App\Http\Resources\SearchCategoriesResultResource;
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

        if ($pagination_count !== 20) {
            // Paginate and map the results
            $categories = Category::withCount('books')
                ->paginate($pagination_count)
                ->through(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->getTranslation('name', app()->getLocale()),
                        'slug' => $category->getTranslation('slug', app()->getLocale()),
                        'books_count' => $category->books_count,
                    ];
                });

            return $this->response_success($categories, 'Categories retrieved');
        } else {
            // Get all categories and map them
            $categories = Category::withCount('books')
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->getTranslation('name', app()->getLocale()),
                        'slug' => $category->getTranslation('slug', app()->getLocale()),
                        'books_count' => $category->books_count,
                    ];
                });

            return $this->response_success($categories, 'Categories retrieved');
        }
    }


    public function searchForCategory($keyword): JsonResponse
    {
        $results = Category::where(function($query) use ($keyword) {
            $query->where('name', 'like', "%{$keyword}%")
                ->orWhere('slug', 'like', "%{$keyword}%")
                ->withCount('books')
                ->orderBy('name', 'asc');
        })->paginate(10);
        Log::info('ss', [$results]);
        $results = SearchCategoriesResultResource::collection($results);
        $next_page_url = $results->nextPageUrl();
        $data = [
            'results' => $results,
            'next_page_url' => $next_page_url
        ];
        return $this->response_success($data, 'Categories search results retrieved');
    }

    public function getCategoryBooks($category): JsonResponse
    {
        $books = Book::where('is_draft', false)
            ->where('status', 'approved')
            ->paginate(12);
        $next_page_url = $books->nextPageUrl();
        $books = BookCardResource::collection($books);
        $category = Category::whereJsonContains('slug->' . app()->getLocale(), $category)->first();
        $category_name = $category->getTranslation('name', app()->getLocale());
        $data = [
            'category_name' => $category_name,
            'books' =>  $books,
            'next_page_url' => $next_page_url,
            'books_count' => 20,
        ];
        return $this->response_success($data, 'Categories retrieved');
    }
}
