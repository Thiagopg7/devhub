<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Config;
use App\Support\ApiCache;
use Illuminate\Http\JsonResponse;

class ConfigController extends Controller
{
    /** Grupos seguros para exposição pública (scripts/analytics ficam de fora). */
    private const PUBLIC_GROUPS = ['general', 'contact', 'footer'];

    public function index(): JsonResponse
    {
        $payload = ApiCache::remember(ApiCache::CONFIG, 'public', function () {
            $grouped = Config::whereIn('group', self::PUBLIC_GROUPS)
                ->get()
                ->groupBy('group')
                ->map(fn ($items) => $items->pluck('value', 'key'));

            return ['data' => $grouped];
        });

        return response()->json($payload);
    }
}
