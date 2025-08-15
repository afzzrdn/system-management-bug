<?php

namespace App\Models;

use App\Enums\BugType;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Bug extends Model
{
    use HasFactory, Notifiable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title', 'description', 'priority', 'status', 'type', 'project_id', 'reported_by', 'assigned_to', 'resolved_at', 'schedule_start_at', 'due_at', 'delay_reason', 'overdue_notified_at',
    ];

    protected $casts = [
        'type' => BugType::class,
        'resolved_at' => 'datetime',
        'schedule_start_at' => 'datetime',
        'due_at' => 'datetime',
        'overdue_notified_at' => 'datetime',
    ];

    protected $appends = ['resolution_duration_for_humans'];

    public function project() { return $this->belongsTo(Project::class); }
    public function reporter() { return $this->belongsTo(User::class, 'reported_by'); }
    public function assignee() { return $this->belongsTo(User::class, 'assigned_to'); }
    public function attachments() { return $this->hasMany(Attachment::class); }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (!$model->id) $model->id = Str::uuid();
        });
    }

    protected function resolutionDurationForHumans(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->schedule_start_at && $this->resolved_at) {
                    return $this->resolved_at->diffForHumans($this->schedule_start_at, true, false, 2);
                }
                return null;
            }
        );
    }
}
