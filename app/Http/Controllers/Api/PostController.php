<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Services\PostService;
use App\Support\ApiCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(
        private readonly PostService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $page = $request->integer('page', 1);

        if ($request->filled('category')) {
            $slug = $request->string('category')->toString();

            $result = ApiCache::remember(ApiCache::POSTS, "index.cat.{$slug}.page.{$page}", function () use ($slug) {
                ['category' => $category, 'posts' => $posts] = $this->service->getByCategory($slug);

                return $category
                    ? ['found' => true, 'payload' => PostResource::collection($posts)->response()->getData(true)]
                    : ['found' => false];
            });

            if (! $result['found']) {
                return response()->json(['message' => 'Categoria não encontrada.'], 404);
            }

            return response()->json($result['payload']);
        }

        $payload = ApiCache::remember(ApiCache::POSTS, "index.all.page.{$page}", function () {
            return PostResource::collection($this->service->getAllActive())->response()->getData(true);
        });

        return response()->json($payload);
    }

    public function show(string $slug): JsonResponse
    {
        $result = ApiCache::remember(ApiCache::POSTS, "show.{$slug}", function () use ($slug) {
            $post = $this->service->findBySlug($slug);

            return $post
                ? ['found' => true, 'payload' => (new PostResource($post))->response()->getData(true)]
                : ['found' => false];
        });

        if (! $result['found']) {
            return response()->json(['message' => 'Post não encontrado.'], 404);
        }

        return response()->json($result['payload']);
    }
}
