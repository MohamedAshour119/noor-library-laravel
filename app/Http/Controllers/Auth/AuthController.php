<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignInRequest;
use App\Http\Requests\SignUpAsCustomerRequest;
use App\Http\Requests\SignUpAsVendorRequest;
use App\Models\User;
use App\Models\Vendor;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('User Token', expiresAt: now()->addHours(24));
            return $this->createSuccessResponse($user, $token, 'You are logged in as a user successfully.');
        }

        // Next, attempt login as a vendor
        if (Auth::guard('vendor')->attempt($credentials)) {
            $vendor = Auth::guard('vendor')->user();
            $token = $vendor->createToken('Vendor Token', expiresAt: now()->addHours(24));
            return $this->createSuccessResponse($vendor, $token, 'You are logged in as a vendor successfully.', true);
        }

        return $this->response_error('You entered wrong credentials', [], 403);
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
        }else if (Auth::guard('vendor')->check()) {
            Auth::guard('vendor')->user()->currentAccessToken()->delete();
            return $this->response_success([], 'Vendor logged out successfully');
        }

        return $this->response_error('No active session found', [], 403);
    }

}
