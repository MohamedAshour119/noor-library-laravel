<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    protected $guarded = [];

//    public function books()
//    {
//        return $this->belongsToMany(Book::class, 'book_language', 'book_id', 'language_id');
//    }
}
