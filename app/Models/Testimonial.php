<?php

namespace App\Models;

use App\Support\ApiCache;
use App\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testimonial extends Model
{
    use HasActivityLog, HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'role',
        'company',
        'content',
        'avatar_image',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['avatar_image_url'];

    public function getAvatarImageUrlAttribute(): ?string
    {
        return $this->avatar_image ? asset('storage/'.$this->avatar_image) : null;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('name');
    }

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (is_null($model->order)) {
                $model->order = (static::max('order') ?? 0) + 1;
            }
        });

        static::saved(fn () => ApiCache::flush(ApiCache::TESTIMONIALS));
        static::deleted(fn () => ApiCache::flush(ApiCache::TESTIMONIALS));
    }
}
