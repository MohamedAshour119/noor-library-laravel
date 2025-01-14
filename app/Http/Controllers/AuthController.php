<?php

namespace App\Http\Controllers;

use App\Http\Requests\SetSocialAccountPasswordRequest;
use App\Http\Requests\SignInRequest;
use App\Http\Requests\SignUpAsCustomerRequest;
use App\Http\Requests\SignUpAsVendorRequest;
use App\Http\Resources\UserResource;
use App\Http\Resources\VendorResource;
use App\Models\User;
use App\Models\Vendor;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use HttpResponses;
    public function signUpAsCustomer(SignUpAsCustomerRequest $request): JsonResponse
    {
        unset($request->google_recaptcha);
        unset($request->password_confirmation);

        User::create([
            'username' => $request->username,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone_number,
            'country_code' => $request->country_code,
            'password' => $request->password,
        ]);
        return $this->response_success([], 'Success');
    }
    public function signUpAsVendor(SignUpAsVendorRequest $request): JsonResponse
    {
        unset($request->google_recaptcha);
        unset($request->password_confirmation);

        Vendor::create([
            'username' => $request->username,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone_number,
            'country_code' => $request->country_code,
            'password' => $request->password,
        ]);
        return $this->response_success([], 'Success');
    }
    public function signIn(SignInRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        // First, attempt login as a normal user
        $user = User::where('email', $credentials['email'])->first();
        if ($user && Hash::check($credentials['password'], $user->password)) {
            $userResource = new UserResource($user);
            $token = $user->createToken('User Token', expiresAt: now()->addHours(24));
            return $this->createSuccessResponse($userResource, $token, 'You are logged in as a user successfully.');
        }

        // Next, attempt login as a vendor
        $vendor = Vendor::where('email', $credentials['email'])->first();
        if ($vendor && Hash::check($credentials['password'], $vendor->password)) {
            $vendorResource = new VendorResource($vendor);
            $token = $vendor->createToken('Vendor Token', expiresAt: now()->addHours(24));
            return $this->createSuccessResponse($vendorResource, $token, 'You are logged in as a vendor successfully.', true);
        }

        return $this->response_error('', ['message' => 'You entered wrong credentials'], 403);
    }

    private function createSuccessResponse($entity, $token, $message, $is_vendor = false)
    {
        $plainToken = $token->plainTextToken;
        $expiresAt = $token->accessToken->expires_at;

        if ($is_vendor) {
            $entity->is_vendor = true;
            return $this->response_success(
                [
                    'data' => $entity,
                    'token' => $plainToken,
                    'expires_at' => $expiresAt,
                ],
                $message,
            );
        }else {
            return $this->response_success(
                [
                    'data' => $entity,
                    'token' => $plainToken,
                    'expires_at' => $expiresAt,
                ],
                $message,
            );
        }
    }

    public function signOut(): JsonResponse
    {
        if (Auth::check()) {
            Auth::user()->currentAccessToken()->delete();
            return $this->response_success([], 'You logged out successfully');
        }

        return $this->response_error('No active session found', [], 403);
    }

    public function setPassword(SetSocialAccountPasswordRequest $request)
    {
        $user = Auth::guard('user')->user();
        $user->update([
            'password' => $request->password,
        ]);
    }
}
