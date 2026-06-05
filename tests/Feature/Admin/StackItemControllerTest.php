<?php

namespace Tests\Feature\Admin;

use App\Models\StackItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class StackItemControllerTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    private const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5l4 2"/></svg>';

    public function test_index_lista_itens_da_stack(): void
    {
        $user = $this->adminUser(['stack.view']);
        StackItem::factory()->create(['name' => 'Laravel']);

        $this->actingAs($user)
            ->get(route('admin.stack.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Stack/Index')
                ->has('stack.data')
            );
    }

    public function test_index_busca_combinada_com_filtro_de_status(): void
    {
        $user = $this->adminUser(['stack.view']);
        StackItem::factory()->create(['name' => 'React', 'is_active' => true]);
        StackItem::factory()->create(['name' => 'React Inativo', 'is_active' => false]);

        $this->actingAs($user)
            ->get(route('admin.stack.index', ['q' => 'React', 'status' => '1']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Stack/Index')
                ->has('stack.data', 1)
                ->where('stack.data.0.name', 'React')
            );
    }

    public function test_store_cria_item(): void
    {
        $user = $this->adminUser(['stack.create']);

        $this->actingAs($user)
            ->post(route('admin.stack.store'), [
                'name' => 'PostgreSQL',
                'icon' => self::ICON,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.stack.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('stack_items', ['name' => 'PostgreSQL']);
    }

    public function test_store_define_order_automaticamente(): void
    {
        $user = $this->adminUser(['stack.create']);
        StackItem::factory()->create(['order' => 1]);

        $this->actingAs($user)
            ->post(route('admin.stack.store'), [
                'name' => 'Redis',
                'icon' => self::ICON,
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('stack_items', ['name' => 'Redis', 'order' => 2]);
    }

    public function test_update_atualiza_item(): void
    {
        $user = $this->adminUser(['stack.edit']);
        $item = StackItem::factory()->create(['name' => 'Vue']);

        $this->actingAs($user)
            ->put(route('admin.stack.update', $item), [
                'name' => 'Vue.js',
                'icon' => self::ICON,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.stack.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('stack_items', ['id' => $item->id, 'name' => 'Vue.js']);
    }

    public function test_destroy_remove_item(): void
    {
        $user = $this->adminUser(['stack.delete']);
        $item = StackItem::factory()->create();

        $this->actingAs($user)
            ->delete(route('admin.stack.destroy', $item))
            ->assertSessionHas('toast.type', 'success');

        $this->assertSoftDeleted('stack_items', ['id' => $item->id]);
    }

    public function test_store_rejeita_campos_invalidos(): void
    {
        $user = $this->adminUser(['stack.create']);

        $this->actingAs($user)
            ->post(route('admin.stack.store'), [
                'name' => '',
                'icon' => '',
            ])
            ->assertSessionHasErrors(['name', 'icon']);
    }

    public function test_acesso_sem_permissao_e_redirecionado(): void
    {
        $user = $this->adminUser([]);

        $this->actingAs($user)
            ->get(route('admin.stack.index'))
            ->assertRedirect(route('admin.dashboard'))
            ->assertSessionHas('toast.type', 'error');
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.stack.index'))
            ->assertRedirect(route('login'));
    }
}
