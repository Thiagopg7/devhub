<?php

namespace App\Support;

use Closure;
use Illuminate\Support\Facades\Cache;

class ApiCache
{
    public const TTL = 3600;

    public const CATEGORIES = 'api.categories';

    public const MENU = 'api.menu';

    public const TECHNOLOGIES = 'api.technologies';

    public const POSTS = 'api.posts';

    public const PAGES = 'api.pages';

    public static function remember(string|array $tags, string $key, Closure $callback): mixed
    {
        return Cache::tags((array) $tags)->remember($key, self::TTL, $callback);
    }

    public static function flush(string ...$tags): void
    {
        Cache::tags($tags)->flush();
    }
}
