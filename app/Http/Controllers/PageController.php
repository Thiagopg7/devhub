<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;

class PageController extends Controller
{
    public function show(string $slug)
    {
        $page = Page::active()
            ->searchable()
            ->where('slug', $slug)
            ->with('galleryImages')
            ->firstOrFail();

        return Inertia::render('Page/Show', [
            'page' => $page,
        ]);
    }
}
