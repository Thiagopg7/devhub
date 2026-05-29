<?php

namespace App\Models;

use App\Support\ApiCache;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class GalleryImage extends Model
{
    use HasFactory;

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

    protected static function booted(): void
    {
        static::creating(function (self $model) {
            if (is_null($model->order)) {
                $model->order = (static::where('imageable_type', $model->imageable_type)
                    ->where('imageable_id', $model->imageable_id)
                    ->max('order') ?? 0) + 1;
            }
        });

        static::deleted(function (self $galleryImage) {
            if ($galleryImage->image && Storage::disk('public')->exists($galleryImage->image)) {
                Storage::disk('public')->delete($galleryImage->image);
            }
        });

        static::saved(fn () => ApiCache::flush(ApiCache::PAGES));
        static::deleted(fn () => ApiCache::flush(ApiCache::PAGES));
    }
}
