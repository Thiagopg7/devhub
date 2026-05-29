<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TechnologyResource;
use App\Models\Technology;
use App\Support\ApiCache;
use Illuminate\Http\JsonResponse;

class TechnologyController extends Controller
{
    public function index(): JsonResponse
    {
        $payload = ApiCache::remember(ApiCache::TECHNOLOGIES, 'index', function () {
            return TechnologyResource::collection(
                Technology::active()->ordered()->get()
            )->response()->getData(true);
        });

        return response()->json($payload);
    }
}
