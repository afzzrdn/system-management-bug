<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'client_id'];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function bugs()
    {
        return $this->hasMany(Bug::class);
    }
}
