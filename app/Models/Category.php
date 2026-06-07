<?php

namespace App\Models;

use App\Support\ApiCache;
use App\Traits\FlushesApiCache;
use App\Traits\HasActivityLog;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

class Category extends Model
{
    use FlushesApiCache, HasActivityLog, HasFactory, Sluggable, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'color',
        'icon',
        'description',
        'is_active',
        'deleted_by',
    ];

    protected $hidden = ['deleted_at', 'updated_at'];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => ['name', 'id'],
                'onUpdate' => true,
            ],
        ];
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function deletedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    protected static function apiCacheTags(): array
    {
        return [ApiCache::CATEGORIES, ApiCache::POSTS];
    }

    protected static function booted(): void
    {
        static::deleting(function (self $category) {
            $category->deleted_by = auth()->id();
            $category->saveQuietly();
        });

        static::saved(fn () => Cache::forget('categories.active.footer'));
        static::deleted(fn () => Cache::forget('categories.active.footer'));
    }
}
