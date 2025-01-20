<?php

namespace App\Models;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Filament\Models\Contracts\HasName;
use Filament\Panel;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Vendor extends Authenticatable implements HasMedia, HasName, FilamentUser, HasAvatar
{
    use HasApiTokens, InteractsWithMedia;
    protected $guarded = [];

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function canAccessPanel(Panel $panel): bool
    {
        return Auth::guard('vendor')->check();

    }
    public function getFilamentName(): string
    {
        return "{$this->username}";
    }
    public function getFilamentAvatarUrl(): ?string
    {
        return $this->getFirstMedia('users_avatars')?->getUrl();
    }
}
