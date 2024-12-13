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
        $categories = Category::paginate(10);
        return $this->response_success($categories, 'Books retrieved');
    }
}
