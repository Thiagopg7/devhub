<?php

namespace App\Services;

use App\Models\Page;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;

class PageService
{
    public function __construct(private readonly FileUploadService $uploadService) {}

    public function getPaginated(int $perPage = 20, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = Page::orderBy('title');

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status !== null && $status !== '') {
            $query->where('is_active', $status === '1');
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function create(array $data, ?UploadedFile $mainImage): Page
    {
        if ($mainImage?->isValid()) {
            $data['main_image'] = $this->uploadService->upload($mainImage, 'pages');
        }

        return Page::create($data);
    }

    public function update(Page $page, array $data, ?UploadedFile $mainImage): Page
    {
        $oldMain = $page->main_image;

        if ($mainImage?->isValid()) {
            $data['main_image'] = $this->uploadService->upload($mainImage, 'pages');
        } else {
            unset($data['main_image']);
        }

        $page->update($data);

        if (isset($data['main_image']) && $oldMain) {
            $this->uploadService->delete($oldMain);
        }

        return $page;
    }

    public function deleteMainImage(Page $page): void
    {
        $this->uploadService->delete($page->main_image);
        $page->update(['main_image' => null]);
    }

    public function delete(Page $page): void
    {
        $page->delete();
    }

    public function purge(Page $page): void
    {
        $this->uploadService->delete($page->main_image);
        $page->forceDelete();
    }
}
