<?php

namespace Tests\Feature\Admin;

use App\Models\Block;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class BlockControllerTest extends TestCase
{
    use CreatesAdminUser;

    use RefreshDatabase;

    public function test_index_lista_blocos(): void
    {
        $user = $this->adminUser(['blocks.view']);
        Block::create(['name' => 'Hero', 'content' => '<h1>Olá</h1>', 'is_active' => true]);

        $this->actingAs($user)
            ->get(route('admin.blocks.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Blocks/Index')
                ->has('blocks.data')
            );
    }

    public function test_store_cria_bloco(): void
    {
        $user = $this->adminUser(['blocks.create']);

        $this->actingAs($user)
            ->post(route('admin.blocks.store'), [
                'name'      => 'Rodapé',
                'content'   => '<p>Conteúdo</p>',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.blocks.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('blocks', ['name' => 'Rodapé']);
    }

    public function test_update_atualiza_bloco(): void
    {
        $user  = $this->adminUser(['blocks.edit']);
        $block = Block::create(['name' => 'Antigo', 'content' => 'x', 'is_active' => true]);

        $this->actingAs($user)
            ->put(route('admin.blocks.update', $block), [
                'name'      => 'Atualizado',
                'content'   => '<p>Novo</p>',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.blocks.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('blocks', ['id' => $block->id, 'name' => 'Atualizado']);
    }

    public function test_destroy_remove_bloco(): void
    {
        $user  = $this->adminUser(['blocks.delete']);
        $block = Block::create(['name' => 'Temporário', 'content' => 'x', 'is_active' => true]);

        $this->actingAs($user)
            ->delete(route('admin.blocks.destroy', $block))
            ->assertRedirect(route('admin.blocks.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseMissing('blocks', ['id' => $block->id]);
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.blocks.index'))
            ->assertRedirect(route('login'));
    }
}
