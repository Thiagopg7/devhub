<?php

namespace App\Models;

use App\Support\ApiCache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class Config extends Model
{
    protected $primaryKey = 'key';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['key', 'group', 'value'];

    protected $casts = ['value' => 'json'];

    public static function getValue(string $key, mixed $default = null): mixed
    {
        return static::find($key)?->value ?? $default;
    }

    public static function setValue(string $key, mixed $value, string $group = 'general'): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value, 'group' => $group]);
    }

    public static function getGroup(string $group): Collection
    {
        return static::where('group', $group)->get()->keyBy('key');
    }

    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget('configs.all');
            ApiCache::flush(ApiCache::CONFIG);
        });
        static::deleted(function () {
            Cache::forget('configs.all');
            ApiCache::flush(ApiCache::CONFIG);
        });
    }
}
