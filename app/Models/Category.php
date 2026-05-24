<?php

namespace App\Models;

use App\Traits\HasActivityLog;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

class Category extends Model
{
    use HasActivityLog, HasFactory, Sluggable, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'color',
        'description',
        'is_active',
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

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    protected static function booted(): void
    {
        static::saved(function (self $category) {
            Cache::forget('api.categories');
            Cache::forget("api.category.{$category->slug}");
        });
        static::deleted(function (self $category) {
            Cache::forget('api.categories');
            Cache::forget("api.category.{$category->slug}");
        });
    }
}
