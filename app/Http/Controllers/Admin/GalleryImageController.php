<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Models\Page;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GalleryImageController extends Controller
{
    public function __construct(private readonly FileUploadService $uploadService) {}

    public function store(Request $request, Page $page): RedirectResponse
    {
        $request->validate([
            'images'   => ['required', 'array', 'min:1'],
            'images.*' => ['image', 'max:5120'],
        ]);

        $uploaded = [];
        try {
            DB::transaction(function () use ($request, $page, &$uploaded) {
                foreach ($request->file('images') as $file) {
                    if ($file->isValid()) {
                        $path       = $this->uploadService->upload($file, 'gallery');
                        $uploaded[] = $path;
                        $page->galleryImages()->create(['image' => $path]);
                    }
                }
            });
        } catch (\Throwable $e) {
            foreach ($uploaded as $path) {
                $this->uploadService->delete($path);
            }
            throw $e;
        }

        return back();
    }

    public function destroy(GalleryImage $galleryImage): RedirectResponse
    {
        $galleryImage->delete();

        return back();
    }
}
