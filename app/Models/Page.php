<?php

namespace App\Models;

use App\Support\ApiCache;
use App\Traits\FlushesApiCache;
use App\Traits\HasActivityLog;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Page extends Model
{
    use FlushesApiCache, HasActivityLog, HasFactory, Sluggable, SoftDeletes;

    protected $fillable = [
        'title',
        'subtitle',
        'eyebrow',
        'slug',
        'main_image',
        'content',
        'is_active',
        'is_searchable',
        'meta_title',
        'meta_description',
        'deleted_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_searchable' => 'boolean',
    ];

    protected $appends = ['main_image_url'];

    protected $hidden = ['deleted_at'];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
                'onUpdate' => true,
            ],
        ];
    }

    protected function mainImageUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->main_image ? asset('storage/'.$this->main_image) : null
        );
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSearchable($query)
    {
        return $query->where('is_searchable', true);
    }

    public function deletedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    public function galleryImages()
    {
        return $this->morphMany(GalleryImage::class, 'imageable')->orderBy('order')->orderBy('id');
    }

    protected static function booted(): void
    {
        static::deleting(function (self $page) {
            $page->deleted_by = auth()->id();
            $page->saveQuietly();
        });

        static::forceDeleted(function (self $page) {
            if ($page->main_image && Storage::disk('public')->exists($page->main_image)) {
                Storage::disk('public')->delete($page->main_image);
            }

            // Gallery images não têm soft delete; dispara o evento `deleted`
            // de cada uma, que apaga o arquivo correspondente.
            $page->galleryImages()->get()->each->delete();
        });

    }

    protected static function apiCacheTags(): array
    {
        return [ApiCache::PAGES];
    }
}
