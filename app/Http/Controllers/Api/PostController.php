<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    public function __construct(
        private readonly PostService $service
    ) {}

    public function index(Request $request): AnonymousResourceCollection|JsonResponse
    {
        if ($request->filled('category')) {
            ['category' => $category, 'posts' => $posts] = $this->service->getByCategory($request->category);

            if (!$category) {
                return response()->json(['message' => 'Categoria não encontrada.'], 404);
            }

            return PostResource::collection($posts);
        }

        return PostResource::collection($this->service->getAllActive());
    }

    public function show(string $slug): PostResource|JsonResponse
    {
        $post = $this->service->findBySlug($slug);

        if (!$post) {
            return response()->json(['message' => 'Post não encontrado.'], 404);
        }

        return new PostResource($post);
    }
}
