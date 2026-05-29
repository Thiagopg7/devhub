<?php

namespace App\Services;

use App\Models\Technology;
use Illuminate\Http\UploadedFile;

class TechnologyService
{
    public function __construct(private readonly FileUploadService $uploadService) {}

    public function create(array $data, ?UploadedFile $icon = null, ?UploadedFile $screenshot = null): Technology
    {
        if ($icon?->isValid()) {
            $data['icon_image'] = $this->uploadService->upload($icon, 'technologies');
        }

        if ($screenshot?->isValid()) {
            $data['screenshot_image'] = $this->uploadService->upload($screenshot, 'technologies');
        }

        return Technology::create($data);
    }

    public function update(Technology $technology, array $data, ?UploadedFile $icon = null, ?UploadedFile $screenshot = null): Technology
    {
        $oldIcon       = $technology->icon_image;
        $oldScreenshot = $technology->screenshot_image;

        if ($icon?->isValid()) {
            $data['icon_image'] = $this->uploadService->upload($icon, 'technologies');
        } else {
            unset($data['icon_image']);
        }

        if ($screenshot?->isValid()) {
            $data['screenshot_image'] = $this->uploadService->upload($screenshot, 'technologies');
        } else {
            unset($data['screenshot_image']);
        }

        $technology->update($data);

        if (isset($data['icon_image']) && $oldIcon) {
            $this->uploadService->delete($oldIcon);
        }

        if (isset($data['screenshot_image']) && $oldScreenshot) {
            $this->uploadService->delete($oldScreenshot);
        }

        return $technology;
    }

    public function delete(Technology $technology): void
    {
        $this->uploadService->delete($technology->icon_image);
        $this->uploadService->delete($technology->screenshot_image);
        $technology->delete();
    }
}
