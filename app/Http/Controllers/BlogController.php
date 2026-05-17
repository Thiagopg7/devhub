<?php

namespace App\Http\Controllers;

use App\Services\PostService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function __construct(private readonly PostService $postService) {}

    public function index(Request $request)
    {
        return Inertia::render('Blog/Index', [
            'posts' => $this->postService->getAllActive(12),
        ]);
    }

    public function show(string $slug)
    {
        $post = $this->postService->findBySlug($slug);

        if (!$post) {
            abort(404);
        }

        return Inertia::render('Blog/Show', [
            'post' => $post,
        ]);
    }
}
