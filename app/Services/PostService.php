<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class PostService
{
    public function __construct(private readonly FileUploadService $uploadService) {}
    public function getAllActive(int $perPage = 15): LengthAwarePaginator
    {
        $page = request()->input('page', 1);

        return Cache::tags(['api-posts'])->remember("api.posts.all.p{$page}", 1800, function () use ($perPage) {
            return Post::active()->with('category')->orderByDesc('created_at')->paginate($perPage);
        });
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

        return $query->paginate($perPage)->withQueryString();
    }

    public function findBySlug(string $slug): ?Post
    {
        return Cache::remember("api.post.{$slug}", 3600, function () use ($slug) {
            return Post::active()->with('category')->where('slug', $slug)->first();
        });
    }

    public function getByCategory(string $categorySlug, int $perPage = 12): array
    {
        $category = Cache::remember("api.category.{$categorySlug}", 3600, function () use ($categorySlug) {
            return Category::active()->where('slug', $categorySlug)->first();
        });

        if (!$category) {
            return ['category' => null, 'posts' => null];
        }

        $page  = request()->input('page', 1);
        $posts = Cache::tags(['api-posts'])->remember("api.posts.cat.{$categorySlug}.p{$page}", 1800, function () use ($category, $perPage) {
            return Post::active()
                ->with('category')
                ->where('category_id', $category->id)
                ->orderByDesc('created_at')
                ->paginate($perPage);
        });

        return ['category' => $category, 'posts' => $posts];
    }

    public function create(array $data, ?UploadedFile $banner = null): Post
    {
        if ($banner?->isValid()) {
            $data['banner_image'] = $this->uploadService->upload($banner, 'posts');
        }

        return Post::create($data);
    }

    public function update(Post $post, array $data, ?UploadedFile $banner = null): Post
    {
        $oldBanner = $post->banner_image;

        if ($banner?->isValid()) {
            $data['banner_image'] = $this->uploadService->upload($banner, 'posts');
        } else {
            unset($data['banner_image']);
        }

        $post->update($data);

        // Só deleta o arquivo antigo após o update persistir com sucesso
        if (isset($data['banner_image']) && $oldBanner) {
            $this->uploadService->delete($oldBanner);
        }

        return $post;
    }

    public function delete(Post $post): void
    {
        $post->delete();
    }
}
