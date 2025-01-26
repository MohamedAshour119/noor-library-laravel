<?php

namespace App\Enums;

enum BookStatus: string
{
    case PENDING = 'pending';
    case PUBLISHED = 'published';
    case REJECTED = 'rejected';

    public static function labels(): array
    {
        return [
            self::PENDING->value => 'pending',
            self::PUBLISHED->value => 'Published',
            self::REJECTED->value => 'rejected',
        ];
    }
}
