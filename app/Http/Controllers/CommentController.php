<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookResource;
use App\Http\Resources\CommentResource;
use App\Models\Book;
use App\Models\Comment;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{
    use HttpResponses;

    public function addComment(Request $request ,$book_id)
    {
        $is_auth_user = Auth::guard('user')->check();
        if (!$is_auth_user) {
            return $this->response_error('You must be customer to comment.', [], 403);
        }
        $custom_messages = [
            'body.required' => 'The comment body cannot be empty.',
            'body.max' => 'The comment cannot exceed 1000 characters.',
        ];
        $validated_data = $request->validate([
           'body' => ['required', 'max:1000']
        ], $custom_messages);

        $comment = Comment::create([
            'user_id' =>  Auth::id(),
            'book_id' => $book_id,
            'body' => $validated_data['body'],
        ]);
        $comment = new CommentResource($comment);
        $book = Book::find($book_id);
        $comments_count = $book->comments_count;
        $data = [
            'comment' => $comment,
            'comments_count' => $comments_count,
        ];

        return $this->response_success($data, 'success');
    }

    public function deleteComment($comment_id)
    {
        $comment = Comment::find($comment_id);
        if ($comment->user_id !== Auth::id()) {
            return $this->response_error('You cannot delete other comments');
        }

        $comment->delete();
        $book = Book::find($comment->book_id);
        $comments_count = $book->comments_count;

        return $this->response_success(['comments_count' => $comments_count], 'You comment deleted successfully.');
    }

    public function getComments($id)
    {
        $comments = Comment::where('book_id', $id)->orderBy('created_at', 'desc')->paginate(2);
        $next_page_url = $comments->nextPageUrl();
        $comments = CommentResource::collection($comments);

        $data = [
            'comments' => $comments,
            'next_page_url' => $next_page_url,
        ];
        return $this->response_success($data, 'Comments fetched successfully.');
    }
}
