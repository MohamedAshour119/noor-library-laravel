<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Book extends Model implements HasMedia
{
    use InteractsWithMedia;
    protected $guarded = [];
    protected $with = ['media', 'vendor', 'category', 'ratings'];
    protected $withCount = ['ratings'];
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
    public function user_rate()
    {
        $user_rate = $this->ratings()->where('user_id', Auth::id())->orWhere('vendor_id', Auth::id())->first();
        return $user_rate->rate;
    }

    protected static function booted(): void
    {
        parent::booted();

        self::creating(function ($model) {
            $model->slug = self::generateSlug($model->title);
        });

        self::created(function ($model) {
            $model->slug = self::generateSlug($model->title, $model->id);
            $model->save();
        });

        self::updating(function ($model) {
            $model->slug = self::generateSlug($model->title, $model->id);
        });
    }


    protected static function generateSlug($title, $id = null): string
    {
        $slug = Str::slug($title, '-');
        $maxLength = 50;

        if (strlen($slug) > $maxLength) {
            $slug = substr($slug, 0, $maxLength);
        }

        // Append the ID if it's provided
        if ($id) {
            $slug .= '-' . $id;
        }

        return $slug;
    }
}
