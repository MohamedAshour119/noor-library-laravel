<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\VerifyPasswordRequest;
use App\Http\Resources\BookResource;
use App\Http\Resources\CommentResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\VendorResource;
use App\Models\Book;
use App\Models\Comment;
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
        $books = Book::paginate(12);
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
            return $this->response_error([], 'Unauthorized!', 401);
        }

        info($user);
        info($user->password);
        info($request->confirm_user_password);

        if (!Hash::check(trim($request->confirm_user_password), $user->password)) {
            return $this->response_error([], 'Invalid password.', 403);
        }

        $token = $user->createToken('ProfileChangeToken', ['profile-update'], expiresAt: now()->addMinutes(15))->plainTextToken;
        return $this->response_success(['token' => $token], __('EditProfileValidationMessages.confirmation_success'));
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = Auth::user();

        // Extract only provided inputs from the request
        $new_data = $request->only(['first_name', 'last_name', 'email', 'password', 'phone_number']);

        // Dynamically build the update data
        $update_data = [];
        if (array_key_exists('first_name', $new_data)) {
            $update_data['first_name'] = $new_data['first_name'];
        }
        if (array_key_exists('last_name', $new_data)) {
            $update_data['last_name'] = $new_data['last_name'];
        }
        if (array_key_exists('email', $new_data)) {
            $update_data['email'] = $new_data['email'];
        }
        if (array_key_exists('phone_number', $new_data)) {
            $update_data['phone'] = $new_data['phone_number'];
        }
        if (!empty($new_data['password'])) {
            $update_data['password'] = Hash::make($new_data['password']);
        }

        // Update the user with the dynamic data
        $user->update($update_data);

        // Return the updated user data
        $userResource = new UserResource($user);
        $data = ['user' => $userResource];

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
            $is_current_vendor = $vendor->id === Auth::guard('vendor')->id();
            $vendor = new VendorResource($vendor);

            $data = [
                'vendor' => $vendor,
                'books_count' => $vendor->books_count,
            ];

            if (!$is_current_vendor) {
                $books = Book::where('vendor_id', $vendor->id)->paginate(12);
                $data['books'] = BookResource::collection($books);
                $data['next_page_url'] = $books->nextPageUrl();
                $reviews_data = $this->getReviews($vendor->id);
                $data['reviews_count'] = $reviews_data['reviews_count'];
                $data['reviews'] = $reviews_data['reviews'];
                $data['reviews_next_page_url'] = $reviews_data['reviews_next_page_url'];
            } else {
                $reviews_data = $this->getReviews($vendor->id);
                $data['reviews_count'] = $reviews_data['reviews_count'];
                $data['reviews'] = $reviews_data['reviews'];
                $data['reviews_next_page_url'] = $reviews_data['reviews_next_page_url'];
            }

            return $this->response_success($data, 'Vendor found!');
        }


        return $this->response_error('User not found!', [], 404);
    }
    private function getReviews ($vendor_id)
    {
        $reviews = Comment::whereHas('book', function ($query) use ($vendor_id) {
            $query->where('vendor_id', $vendor_id);
        })->paginate(5);

        $reviews_next_page_url = $reviews->nextPageUrl();
        $reviews_count = $reviews->total();

        $reviews = $reviews->map(function ($review) {
            return new CommentResource($review, true);
        });

        return [
            'reviews_count' => $reviews_count,
            'reviews' => $reviews,
            'reviews_next_page_url' => $reviews_next_page_url,
        ];
    }
}
