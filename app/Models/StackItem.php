<?php

namespace App\Models;

use App\Support\ApiCache;
use App\Traits\FlushesApiCache;
use App\Traits\HasActivityLog;
use App\Traits\Orderable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StackItem extends Model
{
    use FlushesApiCache, HasActivityLog, HasFactory, Orderable, SoftDeletes;

    protected $fillable = [
        'name',
        'icon',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('name');
    }

    protected static function apiCacheTags(): array
    {
        return [ApiCache::STACK];
    }
}
