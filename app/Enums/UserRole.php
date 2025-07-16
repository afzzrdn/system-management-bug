<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Developer = 'developer';
    case Client = 'client';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Developer => 'Developer',
            self::Client => 'Client / Pelanggan',
        };
    }
}
