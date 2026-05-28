<?php

namespace Tests\Feature\Models;

use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GalleryImageCleanupTest extends TestCase
{
    use RefreshDatabase;

    public function test_delete_apaga_arquivo(): void
    {
        Storage::fake('public');
        $path = 'gallery/img.jpg';
        Storage::disk('public')->put($path, 'fake');

        $page = Page::create(['title' => 'Sobre', 'content' => '<p>x</p>']);
        $image = $page->galleryImages()->create(['image' => $path]);

        $image->delete();

        Storage::disk('public')->assertMissing($path);
        $this->assertDatabaseMissing('gallery_images', ['id' => $image->id]);
    }
}
