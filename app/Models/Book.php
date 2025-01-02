<?php

namespace App\Models;

use App\Traits\GoogleTranslationSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;

class Book extends Model implements HasMedia
{
    use InteractsWithMedia, HasTranslations, GoogleTranslationSlug;

    protected $guarded = [];
    protected $with = ['media', 'vendor', 'category', 'ratings', 'comments'];
    protected $withCount = ['ratings', 'comments'];
    public $translatable = ['title', 'slug', 'description', 'author_name'];
    protected $casts = ['slug' => 'array'];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function sum_ratings_values()
    {
        return $this->ratings()->sum('rate');
    }

    public function average_rating()
    {
        $average = $this->ratings()->avg('rate');
        return round($average, 2);
    }

    public function user_rate($id = null)
    {
        $id = $id ?: Auth::id();
        $is_user = Auth::guard('user')->check();
        if ($is_user) {
            $user_rate = $this->ratings()->where('user_id', $id)->first();
            return $user_rate ? $user_rate->rate : 0;
        }
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function wishlistedByUsers()
    {
        return $this->belongsToMany(User::class, 'wishlists')->withTimestamps();
    }

    protected static function booted()
    {
        static::creating(function ($book) {
            // Generate the slug with 'temp-id' placeholder in the 'creating' event
            $book->slug = $book->getTranslatedText($book->title, 'en', 'temp-id');
        });

        static::created(function ($book) {
            // Replace the 'temp-id' placeholder with the actual book ID
            $book->slug = str_replace('temp-id', $book->id, $book->slug);

            // Save the updated slug with the actual ID
            $book->save();
        });
    }

    private function getTranslatedText($text, $sentLanguage, $id)
    {
        // Map the detected language to other languages
        $languages = ['en', 'ar', 'fr'];
        $translations = [];

        foreach ($languages as $language) {
            // Pass 'temp-id' instead of the actual ID
            $translations[$language] = $this->translateTextDynamically($text, $sentLanguage, $language, $id);
        }

        return $translations;
    }

//    protected static function booted()
//    {
//        static::creating(function ($book) {
//            // Set a temporary slug in the 'creating' event
//            $book->slug = $book->generateSlug($book->title, 'temp-id');
//        });
//
//        static::created(function ($book) {
//            // Update the slug with the actual book ID
//            $book->slug = $book->generateSlug($book->title, $book->id);
//            $book->save();
//        });
//    }
//    private function generateSlug($text, $id)
//    {
//        // Map the slug to multiple languages
//        $languages = ['en', 'ar', 'fr'];
//        $translations = [];
//
//        foreach ($languages as $language) {
//            $translations[$language] = $this->translateTextDynamically($text, 'en', $language, $id);
//        }
//
//        return $translations;
//    }

}
