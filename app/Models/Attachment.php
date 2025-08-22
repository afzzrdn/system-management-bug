<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['bug_id','uploaded_by','file_path','file_name','mime','size'];

    protected function fileName(): Attribute {
        return Attribute::get(fn ($value, $attrs) =>
            $value ?: (isset($attrs['file_path']) ? basename($attrs['file_path']) : null)
        );
    }

    public function bug()     { return $this->belongsTo(Bug::class); }
    public function uploader(){ return $this->belongsTo(User::class, 'uploaded_by'); }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($m) { if (!$m->id) $m->id = (string) Str::uuid(); });
    }
}
