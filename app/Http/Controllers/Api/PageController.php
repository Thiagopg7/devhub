<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageResource;
use App\Models\Page;
use App\Support\ApiCache;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $result = ApiCache::remember(ApiCache::PAGES, "show.{$slug}", function () use ($slug) {
            $page = Page::active()->with('galleryImages')->where('slug', $slug)->first();

            return $page
                ? ['found' => true, 'payload' => (new PageResource($page))->response()->getData(true)]
                : ['found' => false];
        });

        if (! $result['found']) {
            return response()->json(['message' => 'Página não encontrada.'], 404);
        }

        return response()->json($result['payload']);
    }
}
