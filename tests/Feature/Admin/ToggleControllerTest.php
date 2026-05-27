<?php

namespace Tests\Feature\Admin;

use App\Models\Post;
use App\Models\Technology;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class ToggleControllerTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    public function test_ativa_model_valido(): void
    {
        $user = $this->adminUser(['posts.edit']);
        $post = Post::factory()->create(['is_active' => false]);

        $this->actingAs($user)
            ->post(route('admin.toggle.active'), [
                'model'     => 'post',
                'id'        => $post->id,
                'is_active' => true,
            ])
            ->assertRedirect();

        $this->assertTrue((bool) $post->fresh()->is_active);
    }

    public function test_desativa_model(): void
    {
        $user = $this->adminUser(['posts.edit']);
        $post = Post::factory()->create(['is_active' => true]);

        $this->actingAs($user)
            ->post(route('admin.toggle.active'), [
                'model'     => 'post',
                'id'        => $post->id,
                'is_active' => false,
            ])
            ->assertRedirect();

        $this->assertFalse((bool) $post->fresh()->is_active);
    }

    public function test_rejeita_model_invalido(): void
    {
        $user = $this->adminUser(['posts.edit']);

        $this->actingAs($user)
            ->post(route('admin.toggle.active'), [
                'model'     => 'invalido',
                'id'        => 1,
                'is_active' => true,
            ])
            ->assertSessionHas('toast.type', 'error');
    }

    public function test_retorna_erro_quando_item_nao_existe(): void
    {
        $user = $this->adminUser(['posts.edit']);

        $this->actingAs($user)
            ->post(route('admin.toggle.active'), [
                'model'     => 'post',
                'id'        => 99999,
                'is_active' => true,
            ])
            ->assertSessionHas('toast.type', 'error');
    }

    public function test_sem_permissao_redireciona_com_erro(): void
    {
        $user = $this->adminUser([]);
        $post = Post::factory()->create();

        $this->actingAs($user)
            ->post(route('admin.toggle.active'), [
                'model'     => 'post',
                'id'        => $post->id,
                'is_active' => true,
            ])
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'error');
    }

    public function test_toggle_technology_com_permissao_correta(): void
    {
        // A rota exige posts.edit no middleware; o controller verifica technologies.edit internamente
        $user = $this->adminUser(['posts.edit', 'technologies.edit']);
        $tech = Technology::create(['name' => 'Laravel', 'url' => 'https://laravel.com', 'order' => 1, 'is_active' => false]);

        $this->actingAs($user)
            ->post(route('admin.toggle.active'), [
                'model'     => 'technology',
                'id'        => $tech->id,
                'is_active' => true,
            ])
            ->assertRedirect();

        $this->assertTrue((bool) $tech->fresh()->is_active);
    }
}
