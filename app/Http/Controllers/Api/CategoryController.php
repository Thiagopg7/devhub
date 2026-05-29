<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Support\ApiCache;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $payload = ApiCache::remember(ApiCache::CATEGORIES, 'index', function () {
            $categories = Category::active()->withCount('posts')->orderBy('name')->get();

            return CategoryResource::collection($categories)->response()->getData(true);
        });

        return response()->json($payload);
    }
}
