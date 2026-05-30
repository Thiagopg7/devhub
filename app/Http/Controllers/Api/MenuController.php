<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use App\Support\ApiCache;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function index(): JsonResponse
    {
        $payload = ApiCache::remember(ApiCache::MENU, 'index', function () {
            $items = MenuItem::active()
                ->roots()
                ->with(['children' => fn ($q) => $q->active()->orderBy('order')])
                ->orderBy('order')
                ->get();

            return MenuItemResource::collection($items)->response()->getData(true);
        });

        return response()->json($payload);
    }
}
