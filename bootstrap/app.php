<?php

use App\Http\Middleware\CorsMiddleware;
use App\Http\Middleware\EnsureOnlyUsers;
use App\Http\Middleware\EnsureOnlyVendorsUploadBooks;
use App\Http\Middleware\ValidateTempToken;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'vendor.upload' => EnsureOnlyVendorsUploadBooks::class,
            'validate.temp.token' => ValidateTempToken::class,
            'user.access' => EnsureOnlyUsers::class,
            'cors' => CorsMiddleware::class,
        ]);

        $middleware->api([
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Session\Middleware\StartSession::class,
//            \Illuminate\Session\Middleware\AuthenticateSession::class,
            \App\Http\Middleware\SetLocale::class,
            CorsMiddleware::class,
        ]);
        $middleware->web([
            \App\Http\Middleware\SetLocale::class,
            CorsMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->map(\Illuminate\Auth\AuthenticationException::class, function ($exception) {
            $message = __('Auth.must_sign_in', [], session('locale'));

            throw new UnauthorizedHttpException('', $message, $exception, 401);
        });
    })
    ->create();
