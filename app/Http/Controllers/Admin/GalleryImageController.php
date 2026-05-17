<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Models\Page;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GalleryImageController extends Controller
{
    public function __construct(private readonly FileUploadService $uploadService) {}

    public function store(Request $request, Page $page): RedirectResponse
    {
        $request->validate([
            'images'   => ['required', 'array', 'min:1'],
            'images.*' => ['image', 'max:5120'],
        ]);

        foreach ($request->file('images') as $file) {
            if ($file->isValid()) {
                $path = $this->uploadService->upload($file, 'gallery');
                $page->galleryImages()->create(['image' => $path]);
            }
        }

        return back();
    }

    public function destroy(GalleryImage $galleryImage): RedirectResponse
    {
        $this->uploadService->delete($galleryImage->image);
        $galleryImage->delete();

        return back();
    }
}
