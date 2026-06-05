<?php

namespace App\Models;

use App\Support\ApiCache;
use App\Traits\HasActivityLog;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    use HasActivityLog, HasFactory, Sluggable, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'slug',
        'banner_image',
        'content',
        'is_active',
        'is_featured',
        'published_at',
        'meta_title',
        'meta_description',
        'deleted_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function deletedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    protected $hidden = ['deleted_at', 'updated_at'];

    protected $appends = ['banner_image_url'];

    protected function bannerImageUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->banner_image ? asset('storage/'.$this->banner_image) : null
        );
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => ['title', 'id'],
                'onUpdate' => true,
            ],
        ];
    }

    /**
     * Escopo para buscar apenas ativas.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Escopo público: ativas e já publicadas (data de publicação no passado).
     */
    public function scopePublished($query)
    {
        return $query->where('is_active', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    protected static function booted(): void
    {
        static::deleting(function (self $post) {
            $post->deleted_by = auth()->id();
            $post->saveQuietly();
        });

        static::forceDeleted(function (self $post) {
            if ($post->banner_image && Storage::disk('public')->exists($post->banner_image)) {
                Storage::disk('public')->delete($post->banner_image);
            }
        });

        static::saved(fn () => ApiCache::flush(ApiCache::POSTS, ApiCache::CATEGORIES));
        static::deleted(fn () => ApiCache::flush(ApiCache::POSTS, ApiCache::CATEGORIES));
    }
}
