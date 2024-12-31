<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
//        $locale = trim($request->header('Accept-Language', config('app.locale')), '"');
//
//        if (!in_array($locale, ['en', 'fr', 'ar'])) {
//            $locale = config('app.fallback_locale');
//        }
        $locale = session()->get('locale', 'en');
        app()->setLocale($locale);

        return $next($request);
    }
}
