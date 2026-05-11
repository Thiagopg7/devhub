<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    public function __construct(
        private readonly PostService $service
    ) {}

    public function index(): AnonymousResourceCollection
    {
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
