<?php

use Illuminate\Support\Facades\Route;


// routes/web.php


Route::get('/', function () {
    return view('welcome');
});

Route::get('/locale/{locale}', function ($locale) {
    if (in_array($locale, ['ar', 'en', 'fr'])) {
        session()->put('locale', $locale);
    }
    return redirect()->back();
})->name('locale');

Route::view('/{any}', 'welcome')->where('any', '.*');
