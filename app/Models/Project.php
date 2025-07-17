<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    // admin yang buat, tapi project ini milik client
    protected $fillable = ['name', 'description', 'client_id'];

    // Relasi ke user yang memiliki project (client)
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    // Relasi ke bug yang dilaporkan dalam project ini
    public function bugs()
    {
        return $this->hasMany(Bug::class);
    }
}
