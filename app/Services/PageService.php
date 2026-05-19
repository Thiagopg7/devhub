<?php

namespace App\Services;

use App\Models\Page;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;

class PageService
{
    public function __construct(private readonly FileUploadService $uploadService) {}

    public function getPaginated(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        $query = Page::orderBy('title');

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    public function create(array $data, ?UploadedFile $banner, ?UploadedFile $mainImage): Page
    {
        if ($banner?->isValid()) {
            $data['banner_image'] = $this->uploadService->upload($banner, 'pages');
        }

        if ($mainImage?->isValid()) {
            $data['main_image'] = $this->uploadService->upload($mainImage, 'pages');
        }

        return Page::create($data);
    }

    public function update(Page $page, array $data, ?UploadedFile $banner, ?UploadedFile $mainImage): Page
    {
        if ($banner?->isValid()) {
            $this->uploadService->delete($page->banner_image);
            $data['banner_image'] = $this->uploadService->upload($banner, 'pages');
        } else {
            unset($data['banner_image']);
        }

        if ($mainImage?->isValid()) {
            $this->uploadService->delete($page->main_image);
            $data['main_image'] = $this->uploadService->upload($mainImage, 'pages');
        } else {
            unset($data['main_image']);
        }

        $page->update($data);

        return $page;
    }

    public function deleteBanner(Page $page): void
    {
        $this->uploadService->delete($page->banner_image);
        $page->update(['banner_image' => null]);
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
}
