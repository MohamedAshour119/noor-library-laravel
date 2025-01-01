<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $guarded = [];
//    protected $withCount = ['books'];
    protected $casts = [
        'name' => 'array',
        'slug' => 'array',
    ];
    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }

    public function getLocalizedNameAttribute()
    {
        $locale = app()->getLocale();
        return $this->name[$locale] ?? $this->name['en'];
    }
    public function getLocalizedSlugAttribute()
    {
        $locale = app()->getLocale();
        return $this->slug[$locale] ?? $this->slug['en'];
    }
}
