<?php

use Illuminate\Support\Facades\Route;


// routes/web.php

Route::middleware('web')->group(function () {
    Route::get('/', function () {
        return view('welcome');
    });

    Route::view('/{any}', 'welcome')->where('any', '.*');
});
