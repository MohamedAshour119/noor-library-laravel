<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\VerifyPasswordRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserProfileController extends Controller
{
    use HttpResponses;
    public function getUserBooks(): JsonResponse
    {
        $books = Book::paginate(2);
        $next_page_url = $books->nextPageUrl();
        $books = BookResource::collection($books);
        $data = [
            'books' =>  $books,
            'next_page_url' => $next_page_url,
        ];

        return $this->response_success($data, 'Books retrieved');
    }

    public function verifyPassword(VerifyPasswordRequest $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return $this->response_error([], 'Unauthorized!', 403);
        }

        if (!Hash::check($request->confirm_user_password, $user->password)) {
            return $this->response_error([], 'Invalid password.', 403);
        }

        return $this->response_success([], 'Confirmation success');
    }
}
