<?php

use App\Http\Middleware\EnsureOnlyUsers;
use App\Http\Middleware\EnsureOnlyVendorsUploadBooks;
use App\Http\Middleware\EnsureUserIsSocial;
use App\Http\Middleware\SetLocale;
use App\Http\Middleware\ValidateTempToken;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Session\Middleware\StartSession;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'vendor.upload' => EnsureOnlyVendorsUploadBooks::class,
            'validate.temp.token' => ValidateTempToken::class,
            'user.access' => EnsureOnlyUsers::class,
            'social.only' => EnsureUserIsSocial::class,
        ]);

        $middleware->api([
            EncryptCookies::class,
            StartSession::class,
//            \Illuminate\Session\Middleware\AuthenticateSession::class,
            SetLocale::class,
        ]);
        $middleware->web([
            SetLocale::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->map(AuthenticationException::class, function ($exception) {
            $message = __('Auth.must_sign_in', [], session('locale'));

            throw new UnauthorizedHttpException('', $message, $exception, 401);
        });
    })
    ->create();
