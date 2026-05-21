<?php

namespace App\Models;

use App\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class MenuItem extends Model
{
    use HasActivityLog;

    protected $fillable = ['parent_id', 'label', 'url', 'order', 'is_active', 'open_in_new_tab'];

    protected $casts = [
        'is_active'       => 'boolean',
        'open_in_new_tab' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('order');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (is_null($model->order)) {
                $scope = static::when(
                    is_null($model->parent_id),
                    fn ($q) => $q->whereNull('parent_id'),
                    fn ($q) => $q->where('parent_id', $model->parent_id),
                );
                $model->order = ($scope->max('order') ?? 0) + 1;
            }
        });

        static::saved(fn () => Cache::forget('menu.shared'));
        static::deleted(fn () => Cache::forget('menu.shared'));
    }
}
