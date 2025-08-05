<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class InboundMessage extends Model
{
    public $incrementing = false; // non-incrementing
    protected $keyType = 'string'; // UUID

    protected $fillable = [
        'phone',
        'message',
        'device_id',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
