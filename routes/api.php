<?php

use App\Http\Controllers\Auth\AddBookController;
use App\Http\Controllers\Auth\SignInController;
use App\Http\Controllers\Auth\SignOutController;
use App\Http\Controllers\Auth\SignUpController;
use App\Http\Controllers\Profile\UserProfileController;
use Illuminate\Support\Facades\Route;


// routes/api.php
Route::post('/sign-up', [SignUpController::class, 'signUp'])->name('signUp');
Route::post('/sign-in', [SignInController::class, 'signIn'])->name('signIn');

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/sign-out', [SignOutController::class, 'signOut'])->name('signOut');
    Route::post('/add-book', [AddBookController::class, 'addBook'])->name('addBook');
    Route::get('/get-user-books', [UserProfileController::class, 'getUserBooks'])->name('getUserBooks');
});

