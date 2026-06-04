<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;

class PostService
{
    public function __construct(private readonly FileUploadService $uploadService) {}

    public function getAllActive(int $perPage = 15, ?string $search = null, ?string $category = null): LengthAwarePaginator
    {
        return Post::active()
            ->with('category')
            ->when($search, fn ($q) => $q->where('title', 'like', "%{$search}%"))
            ->when($category, fn ($q) => $q->whereHas('category', fn ($q) => $q->where('slug', $category)))
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getLatest(int $count = 3): Collection
    {
        return Post::active()
            ->with('category')
            ->orderByDesc('created_at')
            ->limit($count)
            ->get();
    }

    public function getPaginated(int $perPage = 20, ?string $search = null, ?int $categoryId = null, ?string $status = null): LengthAwarePaginator
    {
        $query = Post::with('category')->orderByDesc('created_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->when(is_numeric($search), fn ($q) => $q->where('id', $search))
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($status !== null && $status !== '') {
            $query->where('is_active', $status === '1');
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function findBySlug(string $slug): ?Post
    {
        return Post::active()->with('category')->where('slug', $slug)->first();
    }

    public function findBySlugWithRelated(string $slug): ?array
    {
        $post = Post::active()->with('category')->where('slug', $slug)->first();

        if (! $post) {
            return null;
        }

        $prev = Post::active()
            ->where('created_at', '<', $post->created_at)
            ->orderByDesc('created_at')
            ->select(['id', 'title', 'slug'])
            ->first();

        $next = Post::active()
            ->where('created_at', '>', $post->created_at)
            ->orderBy('created_at')
            ->select(['id', 'title', 'slug'])
            ->first();

        $related = Post::active()
            ->with('category')
            ->where('id', '!=', $post->id)
            ->when($post->category_id, fn ($q) => $q->where('category_id', $post->category_id))
            ->orderByDesc('created_at')
            ->limit(3)
            ->get();

        if ($related->count() < 3) {
            $excluded = $related->pluck('id')->push($post->id);
            $filler = Post::active()
                ->with('category')
                ->whereNotIn('id', $excluded)
                ->orderByDesc('created_at')
                ->limit(3 - $related->count())
                ->get();
            $related = $related->merge($filler);
        }

        return [
            'post' => $post,
            'prevPost' => $prev,
            'nextPost' => $next,
            'relatedPosts' => $related->values(),
        ];
    }

    public function getByCategory(string $categorySlug, int $perPage = 12): array
    {
        $category = Category::active()->where('slug', $categorySlug)->first();

        if (! $category) {
            return ['category' => null, 'posts' => null];
        }

        $posts = Post::active()
            ->with('category')
            ->where('category_id', $category->id)
            ->orderByDesc('created_at')
            ->paginate($perPage);

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

    public function purge(Post $post): void
    {
        if ($post->banner_image) {
            $this->uploadService->delete($post->banner_image);
        }
        $post->forceDelete();
    }
}
