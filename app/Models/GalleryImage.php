<?php

namespace App\Models;

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
            fn () => $this->image ? asset('storage/' . $this->image) : null
        );
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
