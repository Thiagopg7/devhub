<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    public function __construct(
        private readonly PostService $service
    ) {}

    public function index(): JsonResponse
    {
        $posts = $this->service->getAllActive();
        
        return response()->json($posts);
    }

    public function show(string $slug): JsonResponse
    {
        $post = $this->service->findBySlug($slug);

        if (!$post) {
            return response()->json(['message' => 'Post não encontrado.'], 404);
        }

        return response()->json($post);
    }
}
