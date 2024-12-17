<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Categories\CategoryController;
use App\Http\Controllers\Profile\UserProfileController;
use App\Http\Controllers\Vendors\AddBookController;
use Illuminate\Support\Facades\Route;


// routes/api.php
Route::post('/sign-up-as-customer', [AuthController::class, 'signUpAsCustomer'])->name('signUpAsCustomer');
Route::post('/sign-up-as-vendor', [AuthController::class, 'signUpAsVendor'])->name('signUpAsVendor');
Route::post('/sign-in', [AuthController::class, 'signIn'])->name('signIn');
Route::get('/get-user-books', [UserProfileController::class, 'getUserBooks'])->name('getUserBooks');
Route::get('/categories/{category}', [CategoryController::class, 'getCategoryBooks'])->name('getCategoryBooks');


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/sign-out', [AuthController::class, 'signOut'])->name('signOut');
    Route::post('/add-book', [AddBookController::class, 'addBook'])->name('addBook');
    Route::get('/get-categories', [CategoryController::class, 'getCategories'])->name('getCategories');
    Route::get('/search-category/{keyword}', [CategoryController::class, 'searchForCategory'])->name('searchForCategory');
});

