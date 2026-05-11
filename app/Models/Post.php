<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $fillable = [
        'user_id',
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

    protected $hidden = ['deleted_at', 'updated_at'];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
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
}
