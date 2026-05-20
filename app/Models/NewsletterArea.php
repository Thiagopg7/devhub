<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class NewsletterArea extends Model
{
    protected $fillable = ['name', 'order', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'order'     => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('name');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (is_null($model->order)) {
                $model->order = (static::max('order') ?? 0) + 1;
            }
        });

        static::saved(fn () => Cache::forget('newsletter_areas.active'));
        static::deleted(fn () => Cache::forget('newsletter_areas.active'));
    }
}
