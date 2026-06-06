<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class CategoryControllerTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_index_lista_categorias(): void
    {
        $user = $this->adminUser(['categories.view']);
        Category::create(['name' => 'PHP', 'color' => '#4B5563', 'is_active' => true]);

        $this->actingAs($user)
            ->get(route('admin.categories.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Categories/Index')
                ->has('categories.data')
            );
    }

    public function test_store_cria_categoria(): void
    {
        $user = $this->adminUser(['categories.create']);

        $this->actingAs($user)
            ->post(route('admin.categories.store'), [
                'name' => 'Laravel',
                'color' => '#FF0000',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('categories', ['name' => 'Laravel']);
    }

    public function test_update_atualiza_categoria(): void
    {
        $user = $this->adminUser(['categories.edit']);
        $category = Category::create(['name' => 'Python', 'color' => '#3B82F6', 'is_active' => true]);

        $this->actingAs($user)
            ->put(route('admin.categories.update', $category), [
                'name' => 'Python 3',
                'color' => '#3B82F6',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'Python 3']);
    }

    public function test_store_persiste_icone_valido(): void
    {
        $user = $this->adminUser(['categories.create']);

        $this->actingAs($user)
            ->post(route('admin.categories.store'), [
                'name' => 'Banco de Dados',
                'color' => '#8B5CF6',
                'icon' => 'Database',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('categories', ['name' => 'Banco de Dados', 'icon' => 'Database']);
    }

    public function test_store_rejeita_icone_fora_do_conjunto(): void
    {
        $user = $this->adminUser(['categories.create']);

        $this->actingAs($user)
            ->post(route('admin.categories.store'), [
                'name' => 'Inválida',
                'color' => '#000000',
                'icon' => 'NaoExiste',
                'is_active' => true,
            ])
            ->assertSessionHasErrors('icon');

        $this->assertDatabaseMissing('categories', ['name' => 'Inválida']);
    }

    public function test_store_normaliza_icone_vazio_para_null(): void
    {
        $user = $this->adminUser(['categories.create']);

        $this->actingAs($user)
            ->post(route('admin.categories.store'), [
                'name' => 'Sem Ícone',
                'color' => '#000000',
                'icon' => '',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('categories', ['name' => 'Sem Ícone', 'icon' => null]);
    }

    public function test_update_atualiza_icone(): void
    {
        $user = $this->adminUser(['categories.edit']);
        $category = Category::create(['name' => 'Frontend', 'color' => '#3B82F6', 'icon' => 'Code', 'is_active' => true]);

        $this->actingAs($user)
            ->put(route('admin.categories.update', $category), [
                'name' => 'Frontend',
                'color' => '#3B82F6',
                'icon' => 'Monitor',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('categories', ['id' => $category->id, 'icon' => 'Monitor']);
    }

    public function test_destroy_remove_categoria(): void
    {
        $user = $this->adminUser(['categories.delete']);
        $category = Category::create(['name' => 'Ruby', 'color' => '#EF4444', 'is_active' => true]);

        $this->actingAs($user)
            ->delete(route('admin.categories.destroy', $category))
            ->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertSoftDeleted('categories', ['id' => $category->id]);
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.categories.index'))
            ->assertRedirect(route('login'));
    }

    public function test_sem_permissao_redireciona_para_dashboard(): void
    {
        $user = $this->adminUser([]);

        $this->actingAs($user)
            ->get(route('admin.categories.index'))
            ->assertRedirect(route('admin.dashboard'));
    }
}
