<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use function PHPUnit\Framework\throwException;

class SignOutController extends Controller
{
    use HttpResponses;
    public function signOut(): JsonResponse
    {
        Auth::user()->currentAccessToken()->delete();
        return $this->response_success([], 'You logged out successfully');
    }
}
