<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $guarded = [];
    protected $casts = [
        'billing_info' => 'array',
        'cart_books_ids' => 'array',
    ];
}
