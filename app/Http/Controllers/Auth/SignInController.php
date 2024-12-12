<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignInRequest;
use App\Models\User;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SignInController extends Controller
{
    use HttpResponses;
    public function signIn(SignInRequest $request): JsonResponse
    {
        if(Auth::attempt($request->all())){
            $token = Auth::user()->createToken('User Token', ['*'], expiresAt: now()->addHours(24));
            $accessToken = $token->accessToken;
            $expiresAt = $accessToken->expires_at;

            $plainToken = $token->plainTextToken;

            $user = User::where('email', $request->email)->first();

            return $this->response_success(
                [
                    'data' => $user,
                    'token' => $plainToken,
                    'expires_at' => $expiresAt,
                ],
                'You are logged in successfully',
            );
        }
        return $this->response_error('You entered wrong credentials', [], 403,);
    }
}
