<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    public function show(string $slug): PageResource|JsonResponse
    {
        $page = Page::active()->with('galleryImages')->where('slug', $slug)->first();

        if (!$page) {
            return response()->json(['message' => 'Página não encontrada.'], 404);
        }

        return new PageResource($page);
    }
}
