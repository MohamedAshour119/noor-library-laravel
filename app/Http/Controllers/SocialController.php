<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class SocialController extends Controller implements HasMedia
{
    use HttpResponses, InteractsWithMedia;

    public function googleRedirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function googleCallback()
    {
        $socialiteUser = Socialite::driver('google')->user();
        // Create or update the user
        $user = User::updateOrCreate(
            ['google_id' => $socialiteUser->id],
            [
                'first_name' => $socialiteUser->user['given_name'],
                'last_name' => $socialiteUser->user['family_name'],
                'username' => $this->generateUsername($socialiteUser->user['given_name'], $socialiteUser->user['family_name']),
                'email' => $socialiteUser->user['email'],
            ]
        );

        // Remove old avatar if it exists
        $user->clearMediaCollection('users_avatars');

        // Download the new avatar
        $tempImage = tempnam(sys_get_temp_dir(), 'google_avatar');
        file_put_contents($tempImage, file_get_contents($socialiteUser->avatar));

        // Add the new avatar to the media collection
        $user->addMedia($tempImage)
            ->usingFileName('avatar-' . $user->id . '.jpg')
            ->toMediaCollection('users_avatars');

        $userResource = new UserResource($user);
        $token = $user->createToken('User Token', expiresAt: now()->addHours(24));
        $data = [
            'data' => $userResource,
            'token' => $token->plainTextToken,
            'expires_at' => $token->accessToken->expires_at,
            'is_social_account' => true,
        ];

        $encodedData = base64_encode(json_encode($data));
        if ($user->password) {
            return redirect('/?data=' . $encodedData);
        }else {
            return redirect('/set-password/?data=' . $encodedData);
        }
    }
    function generateUsername($firstName, $lastName) {
        // Convert the first character of each name to lowercase and concatenate the rest
        $firstPart = strtolower(substr($firstName, 0, 1)) . substr($firstName, 1);
        $lastPart = strtolower(substr($lastName, 0, 1)) . substr($lastName, 1);

        // Concatenate the names with an underscore separator
        return $firstPart . '_' . $lastPart;
    }

    public function twitterRedirect()
    {
        return Socialite::driver('twitter-oauth-2')->redirect();
    }

    public function twitterCallback()
    {
        $socialiteUser = Socialite::driver('twitter-oauth-2')->user();

        $first_name = $this->extractFirstAndLastName($socialiteUser->name)['first_name'];
        $last_name = $this->extractFirstAndLastName($socialiteUser->name)['last_name'];
        // Create or update the user
        $user = User::updateOrCreate(
            ['twitter_id' => $socialiteUser->id],
            [
                'first_name' => $first_name ?: null,
                'last_name' => $last_name ?: null,
                'username' => $socialiteUser->nickname,
                'email' => $socialiteUser->email ?: null,
                'password' => bcrypt(Str::random(12)),
            ]
        );

        // Remove old avatar if it exists
        $user->clearMediaCollection('users_avatars');

        // Download the new avatar
        $tempImage = tempnam(sys_get_temp_dir(), 'twitter_avatar');
        file_put_contents($tempImage, file_get_contents($socialiteUser->avatar));

        // Add the new avatar to the media collection
        $user->addMedia($tempImage)
            ->usingFileName('avatar-' . $user->id . '.jpg')
            ->toMediaCollection('users_avatars');

        $userResource = new UserResource($user);
        $token = $user->createToken('User Token', expiresAt: now()->addHours(24));
        $data = [
            'data' => $userResource,
            'token' => $token->plainTextToken,
            'expires_at' => $token->accessToken->expires_at,
            'is_social_account' => true,
        ];

        $encodedData = base64_encode(json_encode($data));
        if ($user->password) {
            return redirect('/?data=' . $encodedData);
        }else {
            return redirect('/set-password/?data=' . $encodedData);
        }
    }
    function extractFirstAndLastName($fullName)
    {
        // Split the name into parts by spaces
        $nameParts = explode(' ', trim($fullName));

        // Extract the first name (first part of the array)
        $firstName = $nameParts[0] ?? '';

        // Extract the last name (last part of the array)
        $lastName = count($nameParts) > 1 ? $nameParts[count($nameParts) - 1] : '';

        return [
            'first_name' => $firstName,
            'last_name' => $lastName,
        ];
    }
}
