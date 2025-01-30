<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PaymobController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

// routes/api.php
Route::middleware('api')->group(function () {
    Route::post('/sign-up-as-customer', [AuthController::class, 'signUpAsCustomer']);
    Route::post('/sign-up-as-vendor', [AuthController::class, 'signUpAsVendor']);
    Route::post('/sign-in', [AuthController::class, 'signIn']);
    Route::get('/get-user-books', [UserProfileController::class, 'getUserBooks']);
    Route::get('/categories/{category}', [CategoryController::class, 'getCategoryBooks']);
    Route::get('/get-categories/{sidebar?}', [CategoryController::class, 'getCategories']);
    Route::get('/search-category/{keyword}', [CategoryController::class, 'searchForCategory']);
    Route::get('/book/{id}/comments', [CommentController::class, 'getComments']);
    Route::get('/users/{username}', [UserProfileController::class, 'getUserInfo']);
    Route::get('/books/{slug}', [BookController::class, 'showBook']);
    Route::get('/home/get-books', [HomeController::class, 'getBooks']);
    Route::get('/get-reviews', [CommentController::class, 'getReviews']);
    Route::get('/books/search/{keyword}', [SearchController::class, 'searchBooks']);
    Route::get('/books/search-keyword/{keyword}', [SearchController::class, 'searchBooksByKeyword']);
    Route::get('/translation/{namespace}', [HomeController::class, 'getTranslation']);
    Route::get('/add-book-options/{languages?}', [BookController::class, 'addBookOptions']);
    Route::get('/home/books/{section}', [HomeController::class, 'getSectionBooks']);

    Route::group(['middleware' => ['auth:sanctum']], function () {
        Route::post('/sign-out', [AuthController::class, 'signOut']);
        Route::post('/add-book', [BookController::class, 'addBook'])->middleware('vendor.upload');
        Route::post('/verify-password', [UserProfileController::class, 'verifyPassword']);
        Route::put('/users/update-profile', [UserProfileController::class, 'updateProfile'])->middleware('validate.temp.token');
        Route::post('/users/update-profile-avatar', [UserProfileController::class, 'updateProfileAvatar']);
        Route::get('/wishlist/{user_id}', [WishlistController::class, 'getWishlistBooks']);

        Route::middleware('user.access')->group(function () {
            Route::post('/books/rating/{id}', [BookController::class, 'ratingBook']);
            Route::post('/book/comments/{book_id}', [CommentController::class, 'addComment']);
            Route::delete('/book/comments/delete/{comment_id}', [CommentController::class, 'deleteComment']);
            Route::post('/wishlist/add/{book_id}', [WishlistController::class, 'addBookToWishlist']);
            Route::delete('/wishlist/delete/{book_id}', [WishlistController::class, 'deleteBookToWishlist']);
            Route::post('/paymob', [PaymobController::class, 'paymob']);
            Route::post('/orders/add', [OrdersController::class, 'addOrder']);

        });
    });
});
Route::get('/callback', [PaymobController::class, 'callback']);
Route::post('/set-password', [AuthController::class, 'setPassword'])->middleware('social.only');
Broadcast::routes(['middleware' => ['auth:api']]);


Route::post('/broadcasting/auth', function (Request $request) {
    $user = auth()->user();
    if (!$user) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    return Broadcast::auth($request);
});

Route::post('/chat/send-message', [ChatController::class, 'sendMessage']);
