<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PostService
{
    public function __construct(private readonly FileUploadService $uploadService) {}

    public function getAllActive(int $perPage = 15, ?string $search = null, ?string $category = null): LengthAwarePaginator
    {
        return Post::published()
            ->with('category')
            ->when($search, fn ($q) => $q->where('title', 'like', "%{$search}%"))
            ->when($category, fn ($q) => $q->whereHas('category', fn ($q) => $q->where('slug', $category)))
            ->orderByDesc('published_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getLatest(int $count = 3): Collection
    {
        return Post::published()
            ->with(['category', 'user:id,name,bio,avatar_image'])
            ->orderByDesc('published_at')
            ->limit($count)
            ->get();
    }

    /**
     * Post em destaque na home. Cai para o mais recente quando nenhum está marcado.
     */
    public function getFeatured(): ?Post
    {
        $with = ['category', 'user:id,name,bio,avatar_image'];

        return Post::published()->with($with)->where('is_featured', true)->first()
            ?? Post::published()->with($with)->orderByDesc('published_at')->first();
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
        return Post::published()->with('category')->where('slug', $slug)->first();
    }

    public function findBySlugWithRelated(string $slug): ?array
    {
        $post = Post::published()
            ->with(['category', 'user:id,name,bio,avatar_image'])
            ->where('slug', $slug)
            ->first();

        if (! $post) {
            return null;
        }

        $prev = Post::published()
            ->where('published_at', '<', $post->published_at)
            ->orderByDesc('published_at')
            ->select(['id', 'title', 'slug'])
            ->first();

        $next = Post::published()
            ->where('published_at', '>', $post->published_at)
            ->orderBy('published_at')
            ->select(['id', 'title', 'slug'])
            ->first();

        $related = Post::published()
            ->with('category')
            ->where('id', '!=', $post->id)
            ->when($post->category_id, fn ($q) => $q->where('category_id', $post->category_id))
            ->orderByDesc('published_at')
            ->limit(3)
            ->get();

        if ($related->count() < 3) {
            $excluded = $related->pluck('id')->push($post->id);
            $filler = Post::published()
                ->with('category')
                ->whereNotIn('id', $excluded)
                ->orderByDesc('published_at')
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

        $posts = Post::published()
            ->with('category')
            ->where('category_id', $category->id)
            ->orderByDesc('published_at')
            ->paginate($perPage);

        return ['category' => $category, 'posts' => $posts];
    }

    public function create(array $data, ?UploadedFile $banner = null): Post
    {
        if ($banner?->isValid()) {
            $data['banner_image'] = $this->uploadService->upload($banner, 'posts');
        }

        // Sem data informada, publica imediatamente.
        $data['published_at'] ??= now();

        return DB::transaction(function () use ($data) {
            $post = Post::create($data);
            $this->ensureSingleFeatured($post);

            return $post;
        });
    }

    public function update(Post $post, array $data, ?UploadedFile $banner = null): Post
    {
        $oldBanner = $post->banner_image;

        if ($banner?->isValid()) {
            $data['banner_image'] = $this->uploadService->upload($banner, 'posts');
        } else {
            unset($data['banner_image']);
        }

        // Em branco publica agora (mesmo comportamento do create).
        if (array_key_exists('published_at', $data)) {
            $data['published_at'] ??= now();
        }

        DB::transaction(function () use ($post, $data) {
            $post->update($data);
            $this->ensureSingleFeatured($post);
        });

        // Só deleta o arquivo antigo após o update persistir com sucesso
        if (isset($data['banner_image']) && $oldBanner) {
            $this->uploadService->delete($oldBanner);
        }

        return $post;
    }

    /**
     * Garante que só exista um post em destaque por vez: ao marcar um,
     * desmarca os demais.
     */
    private function ensureSingleFeatured(Post $post): void
    {
        if (! $post->is_featured) {
            return;
        }

        Post::where('id', '!=', $post->id)
            ->where('is_featured', true)
            ->update(['is_featured' => false]);
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
