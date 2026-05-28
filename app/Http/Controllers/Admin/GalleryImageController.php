<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Models\Page;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GalleryImageController extends Controller
{
    public function __construct(private readonly FileUploadService $uploadService) {}

    public function store(Request $request, Page $page): RedirectResponse
    {
        $request->validate([
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['image', 'max:5120'],
        ]);

        $uploaded = [];
        try {
            DB::transaction(function () use ($request, $page, &$uploaded) {
                foreach ($request->file('images') as $file) {
                    if ($file->isValid()) {
                        $path = $this->uploadService->upload($file, 'gallery');
                        $uploaded[] = $path;
                        $page->galleryImages()->create(['image' => $path]);
                    }
                }
            });

            return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Imagens adicionadas com sucesso.', 'type' => 'success']);
        } catch (\Throwable $e) {
            foreach ($uploaded as $path) {
                $this->uploadService->delete($path);
            }
            Log::error('Erro ao fazer upload de imagens da galeria', ['exception' => $e, 'page_id' => $page->id]);

            return back()->with('toast', [
                'title' => 'Erro!',
                'message' => 'Ocorreu um erro ao fazer upload das imagens. Tente novamente.',
                'type' => 'error',
            ]);
        }
    }

    public function destroy(Request $request, GalleryImage $galleryImage): RedirectResponse
    {
        abort_unless($request->user()?->can('pages.edit'), 403);

        try {
            $galleryImage->delete();

            return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Imagem removida com sucesso.', 'type' => 'success']);
        } catch (\Exception $e) {
            Log::error('Erro ao excluir imagem da galeria', ['exception' => $e, 'gallery_image_id' => $galleryImage->id]);

            return back()->with('toast', [
                'title' => 'Erro!',
                'message' => 'Ocorreu um erro ao remover a imagem. Tente novamente.',
                'type' => 'error',
            ]);
        }
    }
}
