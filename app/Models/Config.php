<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
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
        return Cache::remember("config.{$key}", 3600, function () use ($key, $default) {
            return static::find($key)?->value ?? $default;
        });
    }

    public static function setValue(string $key, mixed $value, string $group = 'general'): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value, 'group' => $group]);
        Cache::forget("config.{$key}");
        Cache::forget("config.group.{$group}");
    }

    public static function getGroup(string $group): \Illuminate\Support\Collection
    {
        return Cache::remember("config.group.{$group}", 3600, function () use ($group) {
            return static::where('group', $group)->get()->keyBy('key');
        });
    }
}
