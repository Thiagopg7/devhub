<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StackItemResource;
use App\Models\StackItem;
use App\Support\ApiCache;
use Illuminate\Http\JsonResponse;

class StackController extends Controller
{
    public function index(): JsonResponse
    {
        $payload = ApiCache::remember(ApiCache::STACK, 'index', function () {
            return StackItemResource::collection(
                StackItem::active()->ordered()->get()
            )->response()->getData(true);
        });

        return response()->json($payload);
    }
}
