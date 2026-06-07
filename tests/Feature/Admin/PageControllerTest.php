<?php

namespace Tests\Feature\Admin;

use App\Models\Page;
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
                'title' => 'Contato',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.pages.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('pages', ['title' => 'Contato']);
    }

    public function test_store_faz_upload_da_imagem_principal(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['pages.create']);

        $mainImage = UploadedFile::fake()->create('main.jpg', 512, 'image/jpeg');

        $this->actingAs($user)
            ->post(route('admin.pages.store'), [
                'title' => 'Portfólio',
                'main_image' => $mainImage,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.pages.index'));

        $page = Page::where('title', 'Portfólio')->firstOrFail();
        $this->assertNotNull($page->main_image);
        Storage::disk('public')->assertExists($page->main_image);
    }

    public function test_update_atualiza_pagina(): void
    {
        $user = $this->adminUser(['pages.edit']);
        $page = Page::create(['title' => 'Antiga', 'is_active' => true]);

        $this->actingAs($user)
            ->put(route('admin.pages.update', $page), [
                'title' => 'Nova',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.pages.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('pages', ['id' => $page->id, 'title' => 'Nova']);
    }

    public function test_update_troca_imagem_principal(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['pages.edit']);

        $oldPath = 'pages/old-main.jpg';
        Storage::disk('public')->put($oldPath, 'antigo');
        $page = Page::create(['title' => 'Página', 'main_image' => $oldPath, 'is_active' => true]);

        $newMain = UploadedFile::fake()->create('novo-main.jpg', 512, 'image/jpeg');

        $this->actingAs($user)
            ->put(route('admin.pages.update', $page), [
                'title' => 'Página',
                'main_image' => $newMain,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.pages.index'));

        Storage::disk('public')->assertMissing($oldPath);
        $this->assertNotSame($oldPath, $page->fresh()->main_image);
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

    public function test_sem_permissao_redireciona_para_dashboard(): void
    {
        $user = $this->adminUser([]);

        $this->actingAs($user)
            ->get(route('admin.pages.index'))
            ->assertRedirect(route('admin.dashboard'));
    }

    public function test_trashed_lista_paginas_excluidas(): void
    {
        $user = $this->adminUser(['pages.delete']);
        $page = Page::create(['title' => 'Excluída', 'is_active' => true]);
        $page->delete();

        $this->actingAs($user)
            ->get(route('admin.pages.trashed'))
            ->assertOk()
            ->assertInertia(fn ($p) => $p->component('Admin/Pages/Trashed')
                ->has('pages.data', 1)
            );
    }

    public function test_restore_recupera_pagina_excluida(): void
    {
        $user = $this->adminUser(['pages.delete']);
        $page = Page::create(['title' => 'Restaurar', 'is_active' => true]);
        $page->delete();

        $this->actingAs($user)
            ->post(route('admin.pages.restore', $page->id))
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'success');

        $this->assertNotSoftDeleted('pages', ['id' => $page->id]);
    }

    public function test_purge_exclui_pagina_permanentemente(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['pages.delete']);
        $main = 'pages/main.jpg';
        Storage::disk('public')->put($main, 'imagem');

        $page = Page::create(['title' => 'Purgar', 'main_image' => $main, 'is_active' => true]);
        $page->delete();

        $this->actingAs($user)
            ->delete(route('admin.pages.purge', $page->id))
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseMissing('pages', ['id' => $page->id]);
        Storage::disk('public')->assertMissing($main);
    }

    public function test_create_renderiza_formulario(): void
    {
        $user = $this->adminUser(['pages.create']);

        $this->actingAs($user)
            ->get(route('admin.pages.create'))
            ->assertOk()
            ->assertInertia(fn ($p) => $p->component('Admin/Pages/Form'));
    }

    public function test_edit_renderiza_formulario_com_pagina(): void
    {
        $user = $this->adminUser(['pages.view']);
        $page = Page::create(['title' => 'Editar', 'is_active' => true]);

        $this->actingAs($user)
            ->get(route('admin.pages.edit', $page))
            ->assertOk()
            ->assertInertia(fn ($p) => $p->component('Admin/Pages/Form')
                ->has('page')
            );
    }
}
