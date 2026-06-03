<?php

namespace Tests\Feature\Admin;

use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class EventControllerTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_index_lista_eventos(): void
    {
        $user = $this->adminUser(['events.view']);
        Event::factory()->create(['title' => 'Laravel Live Brasil']);

        $this->actingAs($user)
            ->get(route('admin.events.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Events/Index')
                ->has('events.data')
            );
    }

    public function test_store_cria_evento(): void
    {
        $user = $this->adminUser(['events.create']);

        $this->actingAs($user)
            ->post(route('admin.events.store'), [
                'title' => 'React Summit SP',
                'type' => 'conf',
                'org' => 'Frontend Guild',
                'date' => '2026-08-10',
                'status' => 'open',
                'cta_style' => 'primary',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.events.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('events', ['title' => 'React Summit SP']);
    }

    public function test_store_define_order_automaticamente(): void
    {
        $user = $this->adminUser(['events.create']);
        Event::factory()->create(['order' => 1]);

        $this->actingAs($user)
            ->post(route('admin.events.store'), [
                'title' => 'Segundo Evento',
                'type' => 'meetup',
                'org' => 'Comunidade',
                'date' => '2026-09-01',
                'status' => 'soon',
                'cta_style' => 'ghost',
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('events', ['title' => 'Segundo Evento', 'order' => 2]);
    }

    public function test_update_atualiza_evento(): void
    {
        $user = $this->adminUser(['events.edit']);
        $event = Event::factory()->create(['title' => 'Evento Original']);

        $this->actingAs($user)
            ->put(route('admin.events.update', $event), [
                'title' => 'Evento Atualizado',
                'type' => $event->type,
                'org' => $event->org,
                'date' => $event->date->format('Y-m-d'),
                'status' => $event->status,
                'cta_style' => $event->cta_style,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.events.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('events', ['id' => $event->id, 'title' => 'Evento Atualizado']);
    }

    public function test_destroy_remove_evento(): void
    {
        $user = $this->adminUser(['events.delete']);
        $event = Event::factory()->create();

        $this->actingAs($user)
            ->delete(route('admin.events.destroy', $event))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseMissing('events', ['id' => $event->id]);
    }

    public function test_store_rejeita_campos_invalidos(): void
    {
        $user = $this->adminUser(['events.create']);

        $this->actingAs($user)
            ->post(route('admin.events.store'), [
                'title' => '',
                'type' => 'invalido',
                'org' => '',
                'date' => 'nao-e-data',
                'status' => 'invalido',
                'cta_style' => 'invalido',
            ])
            ->assertSessionHasErrors(['title', 'type', 'org', 'date', 'status', 'cta_style']);
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.events.index'))
            ->assertRedirect(route('login'));
    }
}
