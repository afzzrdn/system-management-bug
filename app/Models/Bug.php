<?php
namespace App\Models;

use App\Enums\BugType;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Bug extends Model
{
    use HasFactory, Notifiable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title','description','priority','status','type','project_id','reported_by','assigned_to','resolved_at',
    ];

    protected $casts = [
        'type' => BugType::class,
    ];

    public function project(){ return $this->belongsTo(Project::class); }
    public function reporter(){ return $this->belongsTo(User::class,'reported_by'); }
    public function assignee(){ return $this->belongsTo(User::class,'assigned_to'); }
    public function attachments(){ return $this->hasMany(Attachment::class); }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (!$model->id) $model->id = Str::uuid();
        });
    }
}
