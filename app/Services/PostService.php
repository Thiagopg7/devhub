<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Pagination\LengthAwarePaginator;

class PostService
{
    public function getAllActive(int $perPage = 15): LengthAwarePaginator
    {
        return Post::where('is_active', true)
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Post
    {
        return Post::where('slug', $slug)
            ->where('is_active', true)
            ->first();
    }
}