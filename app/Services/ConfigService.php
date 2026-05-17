<?php

namespace App\Services;

use App\Models\Config;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class ConfigService
{
    public function getPaginated(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        $query = Config::orderBy('group')->orderBy('key');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('key', 'like', "%{$search}%")
                  ->orWhere('group', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function create(string $key, mixed $value, string $group): Config
    {
        $config = Config::create(['key' => $key, 'value' => $value, 'group' => $group]);
        Cache::forget("config.{$key}");
        Cache::forget("config.group.{$group}");

        return $config;
    }

    public function update(Config $config, mixed $value, string $group): Config
    {
        $oldGroup = $config->group;
        $config->update(['value' => $value, 'group' => $group]);

        Cache::forget("config.{$config->key}");
        Cache::forget("config.group.{$oldGroup}");
        Cache::forget("config.group.{$group}");

        return $config;
    }

    public function delete(Config $config): void
    {
        Cache::forget("config.{$config->key}");
        Cache::forget("config.group.{$config->group}");
        $config->delete();
    }

    public function parseValue(string $raw): mixed
    {
        if ($raw === '') {
            return null;
        }

        $decoded = json_decode($raw, true);

        return json_last_error() === JSON_ERROR_NONE ? $decoded : $raw;
    }

    public function formatValue(mixed $value): string
    {
        if ($value === null) {
            return '';
        }

        if (is_string($value)) {
            return $value;
        }

        return json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
