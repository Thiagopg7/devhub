<?php

namespace Tests\Feature\Admin;

use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class GalleryImageControllerTest extends TestCase
{
    use CreatesAdminUser, RefreshDatabase;

    private function page(): Page
    {
        return Page::create(['title' => 'Portfólio', 'is_active' => true]);
    }

    public function test_store_faz_upload_de_imagens(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['pages.edit']);
        $page = $this->page();

        $img1 = UploadedFile::fake()->create('foto1.jpg', 512, 'image/jpeg');
        $img2 = UploadedFile::fake()->create('foto2.jpg', 512, 'image/jpeg');

        $this->actingAs($user)
            ->post(route('admin.pages.gallery.store', $page), [
                'images' => [$img1, $img2],
            ])
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'success');

        $this->assertSame(2, $page->galleryImages()->count());
        foreach ($page->galleryImages as $gi) {
            Storage::disk('public')->assertExists($gi->image);
        }
    }

    public function test_store_rejeita_request_sem_imagens(): void
    {
        $user = $this->adminUser(['pages.edit']);
        $page = $this->page();

        $this->actingAs($user)
            ->post(route('admin.pages.gallery.store', $page), [])
            ->assertSessionHasErrors('images');
    }

    public function test_destroy_remove_imagem(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['pages.edit']);
        $page = $this->page();

        $path = 'gallery/foto.jpg';
        Storage::disk('public')->put($path, 'imagem');
        $gi = $page->galleryImages()->create(['image' => $path]);

        $this->actingAs($user)
            ->delete(route('admin.gallery-images.destroy', $gi))
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseMissing('gallery_images', ['id' => $gi->id]);
    }

    public function test_destroy_sem_permissao_redireciona_com_erro(): void
    {
        $user = $this->adminUser([]);
        $page = $this->page();
        $gi = $page->galleryImages()->create(['image' => 'gallery/foto.jpg']);

        $this->actingAs($user)
            ->delete(route('admin.gallery-images.destroy', $gi))
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'error');
    }

    public function test_store_sem_permissao_redireciona_com_erro(): void
    {
        Storage::fake('public');
        $user = $this->adminUser([]);
        $page = $this->page();
        $img = UploadedFile::fake()->create('foto.jpg', 512, 'image/jpeg');

        $this->actingAs($user)
            ->post(route('admin.pages.gallery.store', $page), ['images' => [$img]])
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'error');

        $this->assertSame(0, $page->galleryImages()->count());
    }

    public function test_sem_autenticacao_redireciona(): void
    {
        $page = $this->page();

        $this->post(route('admin.pages.gallery.store', $page), [])
            ->assertRedirect(route('login'));
    }
}
