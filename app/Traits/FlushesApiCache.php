<?php

namespace App\Traits;

use App\Support\ApiCache;

trait FlushesApiCache
{
    public static function bootFlushesApiCache(): void
    {
        static::saved(fn ($model) => $model->flushApiCache());
        static::deleted(fn ($model) => $model->flushApiCache());
    }

    public function flushApiCache(): void
    {
        $tags = static::apiCacheTags();
        if ($tags) {
            ApiCache::flush(...$tags);
        }
    }

    protected static function apiCacheTags(): array
    {
        return [];
    }
}
