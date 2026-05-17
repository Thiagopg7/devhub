<?php

namespace App\Http\Controllers;

use App\Services\PostService;
use App\Services\TechnologyService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(
        private readonly PostService $postService,
        private readonly TechnologyService $technologyService,
    ) {}

    public function index()
    {
        return Inertia::render('Home', [
            'featuredPosts' => $this->postService->getLatest(3),
            'technologies'  => $this->technologyService->getActive(8),
        ]);
    }
}
