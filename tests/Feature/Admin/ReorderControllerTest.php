<?php

namespace Tests\Feature\Admin;

use App\Models\Technology;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class ReorderControllerTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    private function reorderUser(): User
    {
        return $this->adminUser(['technologies.edit', 'menu.edit']);
    }

    public function test_reordena_em_uma_unica_transacao(): void
    {
        $user = $this->reorderUser();

        $a = Technology::create(['name' => 'A', 'url' => 'https://a', 'order' => 1]);
        $b = Technology::create(['name' => 'B', 'url' => 'https://b', 'order' => 2]);
        $c = Technology::create(['name' => 'C', 'url' => 'https://c', 'order' => 3]);

        $this->actingAs($user)
            ->post(route('admin.reorder'), [
                'model' => 'technology',
                'items' => [
                    ['id' => $a->id, 'order' => 3],
                    ['id' => $b->id, 'order' => 1],
                    ['id' => $c->id, 'order' => 2],
                ],
            ])
            ->assertRedirect();

        $this->assertSame(3, $a->fresh()->order);
        $this->assertSame(1, $b->fresh()->order);
        $this->assertSame(2, $c->fresh()->order);
    }

    public function test_bloqueia_modulo_invalido(): void
    {
        $user = $this->reorderUser();

        $this->actingAs($user)
            ->post(route('admin.reorder'), [
                'model' => 'invalido',
                'items' => [['id' => 1, 'order' => 1]],
            ])
            ->assertSessionHas('toast.type', 'error');
    }
}
