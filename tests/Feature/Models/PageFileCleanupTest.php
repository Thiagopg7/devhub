<?php

namespace Tests\Feature\Models;

use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PageFileCleanupTest extends TestCase
{
    use RefreshDatabase;

    private function makePage(array $extra = []): Page
    {
        return Page::create(array_merge([
            'title' => 'Sobre',
            'content' => '<p>x</p>',
        ], $extra));
    }

    public function test_soft_delete_preserva_arquivos(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('pages/main.jpg', 'fake');

        $page = $this->makePage([
            'main_image' => 'pages/main.jpg',
        ]);

        $page->delete();

        Storage::disk('public')->assertExists('pages/main.jpg');
        $this->assertSoftDeleted($page);
    }

    public function test_force_delete_apaga_main_image(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('pages/main.jpg', 'fake');

        $page = $this->makePage([
            'main_image' => 'pages/main.jpg',
        ]);

        $page->forceDelete();

        Storage::disk('public')->assertMissing('pages/main.jpg');
    }

    public function test_force_delete_remove_gallery_images_e_arquivos(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('gallery/a.jpg', 'fake');
        Storage::disk('public')->put('gallery/b.jpg', 'fake');

        $page = $this->makePage();

        $page->galleryImages()->create(['image' => 'gallery/a.jpg']);
        $page->galleryImages()->create(['image' => 'gallery/b.jpg']);

        $page->forceDelete();

        Storage::disk('public')->assertMissing('gallery/a.jpg');
        Storage::disk('public')->assertMissing('gallery/b.jpg');
        $this->assertDatabaseCount('gallery_images', 0);
    }
}
