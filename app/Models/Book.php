<?php

namespace App\Models;

use App\Traits\GoogleTranslation;
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
    use InteractsWithMedia, HasTranslations, GoogleTranslationSlug, GoogleTranslation;

    protected $guarded = [];
    protected $with = ['media', 'vendor', 'category', 'ratings', 'comments'];
    protected $withCount = ['ratings', 'comments'];
    public $translatable = ['title', 'slug', 'description', 'author_name', 'name'];
    protected $casts = [
        'slug' => 'array',
        'title' => 'array',
    ];
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('books_files');
    }

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

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'book_order', 'book_id', 'order_id');
    }
//    public function languages()
//    {
//        return $this->belongsToMany(Language::class, 'book_language', 'language_id', 'book_id');
//    }
    protected function getTranslatedText($text)
    {
        // Map the detected language to other languages
        $languages = ['en', 'ar', 'fr'];
        $translations = [];

        foreach ($languages as $language) {
            $translations[$language] = $this->translateTextDynamically($text, $language);
        }

        return $translations;
    }
    protected static function booted()
    {
        static::creating(function ($book) {
            // Generate slugs for all languages with 'temp-id' placeholder
            $book->slug = [
                'en' => $book->getTranslatedTextSlug($book->title, 'en', 'temp-id'),
                'ar' => $book->getTranslatedTextSlug($book->title, 'ar', 'temp-id'),
                'fr' => $book->getTranslatedTextSlug($book->title, 'fr', 'temp-id'),
            ];
        });

        static::created(function ($book) {
            // Replace 'temp-id' with the actual book ID
            $slugWithId = [];
            foreach ($book->slug as $lang => $slug) {
                $slugWithId[$lang] = str_replace('temp-id', $book->id, $slug);
            }

            // Update the slug with the correct ID
            $book->slug = $slugWithId;
            $book->save();
        });
        static::updating(function ($book) {
            if ($book->isDirty('title')) {
                $book->title = $book->getTranslatedText($book->title);
                $book->slug = $book->getTranslatedTextSlug($book->title, 'en', $book->id);
            }

            if ($book->isDirty('description')) {
                $book->description = $book->getTranslatedText($book->description);
            }

            if ($book->isDirty('author_name')) {
                $book->author_name = $book->getTranslatedText($book->author_name);
            }
        });
    }
    private function getTranslatedTextSlug($text, $sentLanguage, $id)
    {
        $languages = ['en', 'ar', 'fr'];
        $translations = [];

        foreach ($languages as $language) {
            // Pass 'temp-id' instead of the actual ID
            $translations[$language] = $this->translateTextDynamicallySlug($text, $sentLanguage, $language, $id);
        }

        return $translations;
    }

}
