<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Technology;
use App\Models\Testimonial;
use App\Services\PostService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(private readonly PostService $postService) {}

    public function index()
    {
        return Inertia::render('Home', [
            'featuredPosts' => $this->postService->getLatest(3),
            'technologies' => Technology::active()->ordered()->limit(8)->get(),
            'upcomingEvents' => Event::active()
                ->where('date', '>=', now())
                ->orderBy('date')
                ->limit(3)
                ->get(),
            'testimonials' => Testimonial::active()->ordered()->get(),
        ]);
    }
}
