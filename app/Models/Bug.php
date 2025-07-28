<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Bug extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'title',
        'description',
        'priority',
        'status',
        'project_id',
        'reported_by',
        'assigned_to',
        'resolved_at',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }
}
