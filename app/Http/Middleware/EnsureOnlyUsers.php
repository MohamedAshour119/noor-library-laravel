<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\HttpResponses;

class EnsureOnlyUsers
{
    use HttpResponses;
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
//         dd(Auth::guard('user')->user());

        if (!Auth::guard('user')->check() && !Auth::guard('vendor_session')->check()) {
            return $this->response_error('Unauthorized', ['error' => 'Access denied. You must sign in to do this action.'], 401);
        } else if (!Auth::guard('user')) {
            return $this->response_error('Unauthorized', ['error' => 'Access denied. Only customers have access to do that.'], 401);
        }

        return $next($request);
    }
}
