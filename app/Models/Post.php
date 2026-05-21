<?php

namespace App\Models;

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
        'meta_title',
        'meta_description',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    protected $hidden = ['deleted_at', 'updated_at'];

    protected $appends = ['banner_image_url'];

    protected function bannerImageUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->banner_image ? asset('storage/' . $this->banner_image) : null
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

    protected static function booted(): void
    {
        static::forceDeleted(function (self $post) {
            if ($post->banner_image && Storage::disk('public')->exists($post->banner_image)) {
                Storage::disk('public')->delete($post->banner_image);
            }
        });
    }
}
