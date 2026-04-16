<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'subtitle',
        'slug',
        'banner_image',
        'content',
        'is_active',
        'meta_title',
        'meta_description',
    ];

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
