<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\WishlistController;
use App\Http\Middleware\ValidateTempToken;
use Illuminate\Support\Facades\Route;


// routes/api.php
Route::get('/', [AuthController::class, 'ssss'])->name('home');
Route::post('/sign-up-as-customer', [AuthController::class, 'signUpAsCustomer'])->name('signUpAsCustomer');
Route::post('/sign-up-as-vendor', [AuthController::class, 'signUpAsVendor'])->name('signUpAsVendor');
Route::post('/sign-in', [AuthController::class, 'signIn'])->name('signIn');
Route::get('/get-user-books', [UserProfileController::class, 'getUserBooks'])->name('getUserBooks');
Route::get('/categories/{category}', [CategoryController::class, 'getCategoryBooks'])->name('getCategoryBooks');
Route::get('/get-categories/{sidebar?}', [CategoryController::class, 'getCategories'])->name('getCategories');
Route::get('/search-category/{keyword}', [CategoryController::class, 'searchForCategory'])->name('searchForCategory');
Route::get('/book/{id}/comments', [CommentController::class, 'getComments'])->name('getComments');
Route::get('/users/{username}', [UserProfileController::class, 'getUserInfo'])->name('getUserInfo');
Route::get('/books/{slug}', [BookController::class, 'getBookData'])->name('getBookData');
Route::get('/home/get-books', [HomeController::class, 'getBooks'])->name('getBooks');

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/sign-out', [AuthController::class, 'signOut'])->name('signOut');
    Route::post('/add-book', [BookController::class, 'addBook'])->name('addBook')->middleware('vendor.upload');
    Route::post('/verify-password', [UserProfileController::class, 'verifyPassword'])->name('verifyPassword');
    Route::put('/users/update-profile', [UserProfileController::class, 'updateProfile'])->name('updateProfile')->middleware('validate.temp.token');
    Route::post('/users/update-profile-avatar', [UserProfileController::class, 'updateProfileAvatar'])->name('updateProfileAvatar');

    Route::middleware('user.access')->group(function (){
        Route::post('/books/rating/{id}', [BookController::class, 'ratingBook'])->name('ratingBook');
        Route::post('/book/comments/{book_id}', [CommentController::class, 'addComment'])->name('addComment');
        Route::delete('/book/comments/delete/{comment_id}', [CommentController::class, 'deleteComment'])->name('deleteComment');
        Route::post('/wishlist/add/{book_id}', [WishlistController::class, 'addBookToWishlist'])->name('addBookToWishlist');
        Route::delete('/wishlist/delete/{book_id}', [WishlistController::class, 'deleteBookToWishlist'])->name('deleteBookToWishlist');
        Route::get('/wishlist/{user_id}', [WishlistController::class, 'getWishlistBooks'])->name('getWishlistBooks');
    });

});
