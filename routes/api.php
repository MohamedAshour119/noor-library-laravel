<?php

use App\Http\Controllers\Auth\AddBookController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Categories\CategoryController;
use App\Http\Controllers\Profile\UserProfileController;
use Illuminate\Support\Facades\Route;


// routes/api.php
Route::post('/sign-up', [AuthController::class, 'signUp'])->name('signUp');
Route::post('/sign-in', [AuthController::class, 'signIn'])->name('signIn');

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/sign-out', [AuthController::class, 'signOut'])->name('signOut');
    Route::post('/add-book', [AddBookController::class, 'addBook'])->name('addBook');
    Route::get('/get-user-books', [UserProfileController::class, 'getUserBooks'])->name('getUserBooks');
    Route::get('/get-categories', [CategoryController::class, 'getCategories'])->name('getCategories');
    Route::get('/search-category/{keyword}', [CategoryController::class, 'searchForCategory'])->name('searchForCategory');
});

