<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\VerifyPasswordRequest;
use App\Http\Resources\BookResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\VendorResource;
use App\Models\Book;
use App\Models\User;
use App\Models\Vendor;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class UserProfileController extends Controller implements HasMedia
{
    use HttpResponses, InteractsWithMedia;
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

        $token = $user->createToken('ProfileChangeToken', ['profile-update'], expiresAt: now()->addMinutes(15))->plainTextToken;
        return $this->response_success(['token' => $token], 'Confirmation success');
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = Auth::user();
        $new_data = $request->only(['first_name', 'last_name', 'email', 'password', 'phone_number']);
        $update_data = [
            'first_name' => $new_data['first_name'],
            'last_name' => $new_data['last_name'],
            'email' => $new_data['email'],
            'phone' => $new_data['phone_number'],
        ];

        if (!empty($new_data['password'])) {
            $update_data['password'] = Hash::make($new_data['password']);
        }

        $user->update($update_data);

        $user = new UserResource($user);
        $data = ['user' => $user];

        return $this->response_success($data, 'Your info updated successfully.');
    }

    public function updateProfileAvatar(Request $request)
    {
        $validated_data = Validator::make($request->all(), [
            'avatar' => ['required','image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        if ($validated_data->fails()) {
            $errors = collect($validated_data->errors())->map(fn ($messages) => $messages[0]);
            return $this->response_error($errors, 'Validation failed.', 422);
        }

        if ($request->hasFile('avatar')) {

            $user = Auth::user();
            $user->clearMediaCollection('users_avatars');
            Log::info('sss');

            $media = $user->addMediaFromRequest('avatar')->toMediaCollection('users_avatars');
            $data = [
                'avatar' => $media->getUrl(),
            ];
            return $this->response_success($data, 'Avatar updated successfully');
        }

        return $this->response_error(['avatar' => 'No avatar file was uploaded.'], 'Avatar update failed.', 400);
    }

    public function getUserInfo($username): JsonResponse
    {
        $user = User::where('username', $username)->withCount('wishlists')->first();
        if ($user) {
            $user = new UserResource($user);
            $data = [
                'user' => $user
            ];

            return $this->response_success($data, 'User found!');
        }

        $vendor = Vendor::where('username', $username)
            ->withCount('books')
            ->first();
        if ($vendor) {
            $vendor = new VendorResource($vendor);
            $books = Book::where('vendor_id', $vendor->id)->paginate(12);
            $next_page_url = $books->nextPageUrl();
            $books = BookResource::collection($books);

            $data = [
                'vendor' => $vendor,
                'books' => [],
                'next_page_url' => [],
                'books_count' => $vendor->books_count,
            ];
            return $this->response_success($data, 'Vendor found!');
        }

        return $this->response_error('User not found!', [], 404);
    }
}
