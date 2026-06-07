<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Orderable
{
    public static function bootOrderable(): void
    {
        static::creating(fn ($model) => $model->assignOrder());
    }

    public function assignOrder(): void
    {
        if (is_null($this->order)) {
            $this->order = (static::orderScope($this)->max('order') ?? 0) + 1;
        }
    }

    protected static function orderScope($model): Builder
    {
        return static::query();
    }
}
