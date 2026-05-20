<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Block extends Model
{
    use HasFactory, Sluggable;

    protected $table = 'blocks';

    protected $fillable = [
        'name',
        'slug',
        'content',
        'is_active',
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
                'onUpdate' => true,
            ],
        ];
    }

    /**
     * Escopo para buscar apenas soluções ativas.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
