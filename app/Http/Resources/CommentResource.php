<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $this->user;
        $user_avatar = '';
        if ($this->resource && method_exists($user, 'getFirstMedia')) {
            $user_avatar = $user->getFirstMedia('users_avatars')?->getUrl() ?? '';
        }

        $user_rating = $this->book->user_rate($user->id);

        return [
            'id' => $this->id,
            'user' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'username' => $user->username,
                'avatar' => $user_avatar,
            ],
            'rating' => $user_rating,
            'body' => $this->body,
            'created_at' => $this->created_at->diffForHumans(),
        ];
    }
}
