<?php

namespace App\Models;

use App\Support\ApiCache;
use App\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Technology extends Model
{
    use HasActivityLog, HasFactory;

    protected $fillable = [
        'name',
        'description',
        'url',
        'icon_image',
        'screenshot_image',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['icon_image_url', 'screenshot_image_url'];

    public function getIconImageUrlAttribute(): ?string
    {
        return $this->icon_image ? asset('storage/'.$this->icon_image) : null;
    }

    public function getScreenshotImageUrlAttribute(): ?string
    {
        return $this->screenshot_image ? asset('storage/'.$this->screenshot_image) : null;
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

        static::saved(fn () => ApiCache::flush(ApiCache::TECHNOLOGIES));
        static::deleted(fn () => ApiCache::flush(ApiCache::TECHNOLOGIES));
    }
}
