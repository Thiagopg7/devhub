<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $categories = Cache::remember('api.categories', 3600, function () {
            return Category::active()->withCount('posts')->orderBy('name')->get();
        });

        return CategoryResource::collection($categories);
    }
}
