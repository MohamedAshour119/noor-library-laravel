<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Get the Origin header from the request
        $origin = $request->headers->get('Origin');

        // Allow specific origins (you can add more as needed)
        $allowedOrigins = [
            'http://localhost:8000',
            'http://127.0.0.1:8000', // Include variations for local testing
            'https://your-production-domain.com',
        ];

        // Handle preflight (OPTIONS) requests
        if ($request->isMethod('OPTIONS')) {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $origin ?? '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization')
                ->header('Access-Control-Allow-Credentials', 'true');
        }

        // Proceed with the request if the origin is allowed
        if (in_array($origin, $allowedOrigins)) {
            return $next($request)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization')
                ->header('Access-Control-Allow-Credentials', 'true');
        }

        // Deny access if the origin is not allowed
        return $next($request);
    }
}
