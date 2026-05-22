<?php

namespace Tests\Feature\Admin;

use App\Models\NewsletterArea;
use App\Models\NewsletterSubscriber;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class NewsletterSubscriberControllerTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(array $perms = []): User
    {
        $role = Role::firstOrCreate(['name' => 'Administrador', 'guard_name' => 'web']);

        foreach ($perms as $name) {
            $perm = Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
            $role->givePermissionTo($perm);
        }

        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }

    private function createSubscriber(array $attrs = []): NewsletterSubscriber
    {
        $area = NewsletterArea::create(['name' => 'Geral', 'is_active' => true]);

        return NewsletterSubscriber::create(array_merge([
            'name'               => 'João Silva',
            'email'              => 'joao@example.com',
            'newsletter_area_id' => $area->id,
            'ip_address'         => '127.0.0.1',
        ], $attrs));
    }

    public function test_index_lista_inscritos(): void
    {
        $user = $this->adminUser(['newsletter_subscribers.view']);
        $this->createSubscriber();

        $this->actingAs($user)
            ->get(route('admin.newsletter-subscribers.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/NewsletterSubscribers/Index')
                ->has('subscribers.data')
                ->has('total')
            );
    }

    public function test_index_exibe_total_de_inscritos(): void
    {
        $user = $this->adminUser(['newsletter_subscribers.view']);
        $this->createSubscriber(['email' => 'a@example.com']);
        $this->createSubscriber(['email' => 'b@example.com']);

        $this->actingAs($user)
            ->get(route('admin.newsletter-subscribers.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('total', 2));
    }

    public function test_destroy_remove_inscrito(): void
    {
        $user       = $this->adminUser(['newsletter_subscribers.delete']);
        $subscriber = $this->createSubscriber();

        $this->actingAs($user)
            ->delete(route('admin.newsletter-subscribers.destroy', $subscriber))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseMissing('newsletter_subscribers', ['id' => $subscriber->id]);
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.newsletter-subscribers.index'))
            ->assertRedirect(route('login'));
    }
}
