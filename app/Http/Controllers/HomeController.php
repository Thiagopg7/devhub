<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Event;
use App\Models\Post;
use App\Models\StackItem;
use App\Models\Technology;
use App\Models\Testimonial;
use App\Services\PostService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(private readonly PostService $postService) {}

    public function index()
    {
        // TEMP DIAGNÓSTICO: renderiza a Home sem dados para isolar se o 502 do
        // edge vem do conteúdo das props. REVERTER depois do teste.
        return Inertia::render('Home', [
            'ok' => true,
        ]);

        return Inertia::render('Home', [
            'featuredPosts' => $this->postService->getLatest(3),
            'featuredPost' => $this->postService->getFeatured(),
            'technologies' => Technology::active()->ordered()->limit(8)->get(),
            'upcomingEvents' => Event::active()
                ->where('date', '>=', now())
                ->orderBy('date')
                ->limit(3)
                ->get(),
            'testimonials' => Testimonial::active()->ordered()->get(),
            'stackItems' => StackItem::active()->ordered()->get(['name', 'icon']),
            'stats' => [
                'publishedPosts' => Post::published()->count(),
                'categories' => Category::active()->count(),
            ],
        ]);
    }
}
