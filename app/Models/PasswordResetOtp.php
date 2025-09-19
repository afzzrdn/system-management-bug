<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class PasswordResetOtp extends Model
{
    use HasFactory;

    protected $fillable = [
        'identifier',
        'otp',
        'token',
        'is_used',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_used' => 'boolean',
    ];

    public function isExpired()
    {
        return $this->expires_at < Carbon::now();
    }

    public function scopeValid($query)
    {
        return $query->where('is_used', false)
                    ->where('expires_at', '>', Carbon::now());
    }
}
