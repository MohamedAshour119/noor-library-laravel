<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookResource;
use App\Http\Resources\CommentResource;
use App\Models\Book;
use App\Models\Comment;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    use HttpResponses;

    public function addComment(Request $request ,$book_id)
    {
        $is_auth_user = Auth::guard('user_api')->check();
        if (!$is_auth_user) {
            return $this->response_error('You must be customer to comment.', [], 403);
        }

        $validated_data = $request->validate([
           'body' => ['required', 'max:1000']
        ]);

        $comment = Comment::create([
            'user_id' =>  Auth::id(),
            'book_id' => $book_id,
            'body' => $validated_data['body'],
        ]);
        $comment = new CommentResource($comment);

        return $this->response_success(['comment' => $comment], 'success');
    }
}
