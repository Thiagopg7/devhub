<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PostService
{
    public function __construct(private readonly FileUploadService $uploadService) {}
    public function getAllActive(int $perPage = 15): LengthAwarePaginator
    {
        return Post::active()
            ->with('category')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function getLatest(int $count = 3): Collection
    {
        return Post::active()
            ->with('category')
            ->orderByDesc('created_at')
            ->limit($count)
            ->get();
    }

    public function getPaginated(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        $query = Post::with('category')->orderBy('id', 'ASC');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->when(is_numeric($search), fn ($q) => $q->where('id', $search))
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Post
    {
        return Post::active()->with('category')->where('slug', $slug)->first();
    }

    public function getByCategory(string $categorySlug, int $perPage = 12): array
    {
        $category = Category::active()->where('slug', $categorySlug)->first();

        if (!$category) {
            return ['category' => null, 'posts' => null];
        }

        $posts = Post::active()
            ->with('category')
            ->where('category_id', $category->id)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return ['category' => $category, 'posts' => $posts];
    }

    public function create(array $data): Post
    {
        return Post::create($data);
    }

    public function update(Post $post, array $data): Post
    {
        $post->update($data);

        return $post;
    }

    public function delete(Post $post): void
    {
        $this->uploadService->delete($post->banner_image);
        $post->delete();
    }
}
