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
        'ticket_number',
        'title',
        'description',
        'priority',
        'status',
        'type',
        'project_id',
        'reported_by',
        'assigned_to',
        'resolved_at',
        'schedule_start_at',
        'due_at',
        'delay_reason',
        'overdue_notified_at',
        'is_approved',
        'approved_at',
        'approved_by',
            'approval_reminder_sent_at',
            'approval_canceled_at',
    ];

    protected $casts = [
        'type' => BugType::class,
        'is_approved' => 'boolean',
        'resolved_at' => 'datetime',
        'schedule_start_at' => 'datetime',
        'due_at' => 'datetime',
        'approved_at' => 'datetime',
        'overdue_notified_at' => 'datetime',
            'approval_reminder_sent_at' => 'datetime',
            'approval_canceled_at' => 'datetime',
    ];

    protected $appends = ['resolution_duration_for_humans'];

    public function project() { return $this->belongsTo(Project::class); }
    public function reporter() { return $this->belongsTo(User::class, 'reported_by'); }
    public function assignee() { return $this->belongsTo(User::class, 'assigned_to'); }
    public function approver() { return $this->belongsTo(User::class, 'approved_by'); }
    public function attachments() { return $this->hasMany(Attachment::class); }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = Str::uuid();
            }

            if (!$model->ticket_number) {
                $model->ticket_number = self::generateTicketNumber();
            }

            if (!$model->status) {
                $model->status = 'pending';
            }

            if ($model->is_approved === null) {
                $model->is_approved = false;
            }
        });
    }

    public static function generateTicketNumber(): string
    {
        $prefix = 'BUG';
        $date = now()->format('Ymd');

        $last = self::where('ticket_number', 'like', "$prefix-$date-%")
            ->lockForUpdate()
            ->orderByRaw("CAST(SUBSTRING(ticket_number FROM 'BUG-[0-9]+-([0-9]+)') AS INTEGER) DESC")
            ->first();

        $sequence = $last ? intval(substr($last->ticket_number, -4)) + 1 : 1;

        return sprintf('%s-%s-%04d', $prefix, $date, $sequence);
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
