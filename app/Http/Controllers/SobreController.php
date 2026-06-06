<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class SobreController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Sobre', [
            'stats' => [
                'publishedPosts' => Post::published()->count(),
                'categories' => Category::active()->count(),
            ],
            'tracks' => Category::active()
                ->withCount(['posts' => fn ($q) => $q->published()])
                ->orderByDesc('posts_count')
                ->get(['id', 'name', 'slug', 'color', 'icon', 'description']),
        ]);
    }
}
