<?php

namespace Tests\Feature\Admin;

use App\Models\Technology;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ReorderControllerTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        $role = Role::firstOrCreate(['name' => 'Administrador', 'guard_name' => 'web']);
        foreach (['technologies.edit', 'menu.edit'] as $name) {
            $perm = Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
            $role->givePermissionTo($perm);
        }

        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }

    public function test_reordena_em_uma_unica_transacao(): void
    {
        $user = $this->adminUser();

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
        $user = $this->adminUser();

        $this->actingAs($user)
            ->post(route('admin.reorder'), [
                'model' => 'invalido',
                'items' => [['id' => 1, 'order' => 1]],
            ])
            ->assertSessionHasErrors('model');
    }
}
