<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $avatar = '';

        if ($this->resource && method_exists($this->resource, 'getFirstMedia')) {
            $avatar = $this->resource->getFirstMedia('users_avatars')?->getUrl() ?? '';
        }

        return [
            'id' => $this->id,
            'username' => $this->username,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'country_code' => $this->country_code,
            'email' => $this->email,
            'avatar' => $avatar,
            "created_at" => $this->created_at?->format('M d'),
            "updated_at" => $this->updated_at?->format('M d'),
            'is_vendor' => false,
        ];
    }
}
