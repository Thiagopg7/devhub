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
        $search = $request->input('busca');

        return Inertia::render('Blog/Index', [
            'posts' => $this->postService->getAllActive(12, $search),
            'filters' => ['busca' => $search],
        ]);
    }

    public function show(string $slug)
    {
        $post = $this->postService->findBySlug($slug);

        if (! $post) {
            abort(404);
        }

        return Inertia::render('Blog/Show', [
            'post' => $post,
        ]);
    }

    public function byCategory(string $slug)
    {
        ['category' => $category, 'posts' => $posts] = $this->postService->getByCategory($slug);

        if (! $category) {
            abort(404);
        }

        return Inertia::render('Blog/Category', [
            'category' => $category,
            'posts' => $posts,
        ]);
    }
}
