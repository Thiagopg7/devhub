<?php

namespace Tests\Feature\Admin;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class PageControllerTest extends TestCase
{
    use CreatesAdminUser;

    use RefreshDatabase;

    public function test_index_lista_paginas(): void
    {
        $user = $this->adminUser(['pages.view']);
        Page::create(['title' => 'Sobre', 'is_active' => true]);

        $this->actingAs($user)
            ->get(route('admin.pages.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Pages/Index')
                ->has('pages.data')
            );
    }

    public function test_store_cria_pagina_sem_imagens(): void
    {
        $user = $this->adminUser(['pages.create']);

        $this->actingAs($user)
            ->post(route('admin.pages.store'), [
                'title'     => 'Contato',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.pages.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('pages', ['title' => 'Contato']);
    }

    public function test_store_faz_upload_de_banner_e_imagem_principal(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['pages.create']);

        $banner    = UploadedFile::fake()->create('banner.jpg', 512, 'image/jpeg');
        $mainImage = UploadedFile::fake()->create('main.jpg', 512, 'image/jpeg');

        $this->actingAs($user)
            ->post(route('admin.pages.store'), [
                'title'        => 'Portfólio',
                'banner_image' => $banner,
                'main_image'   => $mainImage,
                'is_active'    => true,
            ])
            ->assertRedirect(route('admin.pages.index'));

        $page = Page::where('title', 'Portfólio')->firstOrFail();
        $this->assertNotNull($page->banner_image);
        $this->assertNotNull($page->main_image);
        Storage::disk('public')->assertExists($page->banner_image);
        Storage::disk('public')->assertExists($page->main_image);
    }

    public function test_update_atualiza_pagina(): void
    {
        $user = $this->adminUser(['pages.edit']);
        $page = Page::create(['title' => 'Antiga', 'is_active' => true]);

        $this->actingAs($user)
            ->put(route('admin.pages.update', $page), [
                'title'     => 'Nova',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.pages.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('pages', ['id' => $page->id, 'title' => 'Nova']);
    }

    public function test_update_troca_banner(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['pages.edit']);

        $oldPath = 'pages/old-banner.jpg';
        Storage::disk('public')->put($oldPath, 'antigo');
        $page = Page::create(['title' => 'Página', 'banner_image' => $oldPath, 'is_active' => true]);

        $newBanner = UploadedFile::fake()->create('novo-banner.jpg', 512, 'image/jpeg');

        $this->actingAs($user)
            ->put(route('admin.pages.update', $page), [
                'title'        => 'Página',
                'banner_image' => $newBanner,
                'is_active'    => true,
            ])
            ->assertRedirect(route('admin.pages.index'));

        Storage::disk('public')->assertMissing($oldPath);
        $this->assertNotSame($oldPath, $page->fresh()->banner_image);
    }

    public function test_destroy_remove_pagina(): void
    {
        $user = $this->adminUser(['pages.delete']);
        $page = Page::create(['title' => 'Remover', 'is_active' => true]);

        $this->actingAs($user)
            ->delete(route('admin.pages.destroy', $page))
            ->assertRedirect(route('admin.pages.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertSoftDeleted('pages', ['id' => $page->id]);
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.pages.index'))
            ->assertRedirect(route('login'));
    }
}
