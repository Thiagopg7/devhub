<?php

namespace App\Models;

use App\Support\ApiCache;
use App\Traits\FlushesApiCache;
use App\Traits\Orderable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class GalleryImage extends Model
{
    use FlushesApiCache, HasFactory, Orderable;

    protected $fillable = [
        'imageable_type',
        'imageable_id',
        'image',
        'order',
    ];

    protected $appends = ['image_url'];

    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->image ? asset('storage/'.$this->image) : null
        );
    }

    protected static function orderScope($model): Builder
    {
        return static::where('imageable_type', $model->imageable_type)
            ->where('imageable_id', $model->imageable_id);
    }

    protected static function apiCacheTags(): array
    {
        return [ApiCache::PAGES];
    }

    protected static function booted(): void
    {
        static::deleted(function (self $galleryImage) {
            if ($galleryImage->image && Storage::disk('public')->exists($galleryImage->image)) {
                Storage::disk('public')->delete($galleryImage->image);
            }
        });
    }
}
