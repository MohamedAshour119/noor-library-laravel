<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Book extends Model implements HasMedia
{
    use InteractsWithMedia;
    protected $guarded = [];
    protected $with = ['media', 'vendor', 'category', 'ratings', 'comments'];
    protected $withCount = ['ratings', 'comments'];
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
    public function user_rate(Request $request)
    {
        $token = $request->bearerToken(); // Get the bearer token from the request

        if ($token) {
            // Use PersonalAccessToken::findToken to find the token by its plain value
            $tokenRecord = PersonalAccessToken::findToken($token);
            if ($tokenRecord) {
                // Access the tokenable (user) associated with the token
                $user = $tokenRecord->tokenable; // Get the user associated with the token
                if ($user) {
                    // Check if the user has a rating for this book
                    $user_rate = $this->ratings()->where('user_id', $user->id)->first();
                    return $user_rate ? $user_rate->rate : 0;
                }
            }
        }
        return 0; // Return 0 if no valid user or rate is found
    }



    public function comments()
    {
        return $this->hasMany(Comment::class);
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
