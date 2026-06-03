<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function __construct(private readonly PostService $postService) {}

    public function index(Request $request)
    {
        $search = $request->input('busca');
        $category = $request->input('categoria');

        $categories = Category::active()
            ->whereHas('posts', fn ($q) => $q->active())
            ->withCount(['posts' => fn ($q) => $q->active()])
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'color']);

        return Inertia::render('Blog/Index', [
            'posts' => $this->postService->getAllActive(12, $search, $category),
            'filters' => ['busca' => $search, 'categoria' => $category],
            'categories' => $categories,
            'totalPosts' => Post::active()->count(),
        ]);
    }

    public function show(string $slug)
    {
        $result = $this->postService->findBySlugWithRelated($slug);

        if (! $result) {
            abort(404);
        }

        return Inertia::render('Blog/Show', $result);
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
