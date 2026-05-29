<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $posts = Post::active()->orderByDesc('updated_at')->get(['slug', 'updated_at']);
        $categories = Category::active()->get(['slug', 'updated_at']);
        $pages = Page::active()->searchable()->get(['slug', 'updated_at']);

        $xml = view('sitemap', compact('posts', 'categories', 'pages'))->render();

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
