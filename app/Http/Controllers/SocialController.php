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
                'password' => bcrypt(Str::random(12)),
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
        ];

        $encodedData = base64_encode(json_encode($data));
        return redirect('/?data=' . $encodedData);
    }
    function generateUsername($firstName, $lastName) {
        // Convert the first character of each name to lowercase and concatenate the rest
        $firstPart = strtolower(substr($firstName, 0, 1)) . substr($firstName, 1);
        $lastPart = strtolower(substr($lastName, 0, 1)) . substr($lastName, 1);

        // Concatenate the names with an underscore separator
        return $firstPart . '_' . $lastPart;
    }
}
