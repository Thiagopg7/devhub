<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PostResource;
use App\Models\Category;
use App\Models\Post;
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

    public function show(string $slug): JsonResponse
    {
        $result = ApiCache::remember(ApiCache::CATEGORIES, "show.{$slug}", function () use ($slug) {
            $category = Category::active()->withCount('posts')->where('slug', $slug)->first();

            if (! $category) {
                return ['found' => false];
            }

            $posts = Post::published()
                ->where('category_id', $category->id)
                ->with('category')
                ->orderByDesc('published_at')
                ->get();

            return ['found' => true, 'payload' => [
                'data' => [
                    ...(new CategoryResource($category))->resolve(),
                    'posts' => PostResource::collection($posts)->resolve(),
                ],
            ]];
        });

        if (! $result['found']) {
            return response()->json(['message' => 'Categoria não encontrada.'], 404);
        }

        return response()->json($result['payload']);
    }
}
