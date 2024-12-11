<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignUpRequest;
use App\Models\User;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use function PHPUnit\Framework\throwException;

class SignUpController extends Controller
{
    use HttpResponses;
    public function signUp(SignUpRequest $request)
    {
        unset($request->google_recaptcha);
        unset($request->password_confirmation);

        User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return $this->response_success(['sadsa' => 14], 'Success');
    }
}
