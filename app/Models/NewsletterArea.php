<?php

namespace App\Models;

use App\Traits\HasActivityLog;
use App\Traits\Orderable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class NewsletterArea extends Model
{
    use HasActivityLog, Orderable;

    protected $fillable = ['name', 'order', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

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
        static::saved(fn () => Cache::forget('newsletter_areas.active'));
        static::deleted(fn () => Cache::forget('newsletter_areas.active'));
    }
}
