<?php

use App\Http\Controllers\Auth\SignUpController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;


// routes/api.php
Route::post('/sign-up', [SignUpController::class, 'signUp'])->name('signUp');
