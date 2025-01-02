<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Category extends Model
{
    use HasTranslations;
    protected $guarded = [];
//    protected $withCount = ['books'];
    public $translatable = ['name', 'slug'];
    protected $casts = [
        'name' => 'array',
        'slug' => 'array',
    ];
    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }
}
