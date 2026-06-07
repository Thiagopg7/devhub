<?php

namespace Tests\Feature\Admin;

use App\Models\Testimonial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class TestimonialControllerTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_index_lista_depoimentos(): void
    {
        $user = $this->adminUser(['testimonials.view']);
        Testimonial::factory()->create(['name' => 'João Silva']);

        $this->actingAs($user)
            ->get(route('admin.testimonials.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Testimonials/Index')
                ->has('testimonials.data')
            );
    }

    public function test_index_busca_combinada_com_filtro_de_status(): void
    {
        $user = $this->adminUser(['testimonials.view']);
        Testimonial::factory()->create(['name' => 'Ana Dev', 'is_active' => true]);
        Testimonial::factory()->create(['name' => 'Ana Inativa', 'is_active' => false]);

        // Busca por "Ana" + status ativo deve trazer apenas a ativa.
        $this->actingAs($user)
            ->get(route('admin.testimonials.index', ['q' => 'Ana', 'status' => '1']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Testimonials/Index')
                ->has('testimonials.data', 1)
                ->where('testimonials.data.0.name', 'Ana Dev')
            );
    }

    public function test_store_cria_depoimento(): void
    {
        $user = $this->adminUser(['testimonials.create']);

        $this->actingAs($user)
            ->post(route('admin.testimonials.store'), [
                'name' => 'Maria Santos',
                'role' => 'Desenvolvedora',
                'content' => 'Ótimo conteúdo, aprendi muito!',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.testimonials.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('testimonials', ['name' => 'Maria Santos']);
    }

    public function test_store_define_order_automaticamente(): void
    {
        $user = $this->adminUser(['testimonials.create']);
        Testimonial::factory()->create(['order' => 1]);

        $this->actingAs($user)
            ->post(route('admin.testimonials.store'), [
                'name' => 'Carlos Lima',
                'role' => 'Engenheiro',
                'content' => 'Conteúdo excelente!',
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('testimonials', ['name' => 'Carlos Lima', 'order' => 2]);
    }

    public function test_update_atualiza_depoimento(): void
    {
        $user = $this->adminUser(['testimonials.edit']);
        $testimonial = Testimonial::factory()->create(['name' => 'Pedro Costa']);

        $this->actingAs($user)
            ->put(route('admin.testimonials.update', $testimonial), [
                'name' => 'Pedro Costa Jr.',
                'role' => 'Tech Lead',
                'content' => 'Conteúdo incrível!',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.testimonials.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('testimonials', ['id' => $testimonial->id, 'name' => 'Pedro Costa Jr.']);
    }

    public function test_destroy_remove_depoimento(): void
    {
        $user = $this->adminUser(['testimonials.delete']);
        $testimonial = Testimonial::factory()->create();

        $this->actingAs($user)
            ->delete(route('admin.testimonials.destroy', $testimonial))
            ->assertSessionHas('toast.type', 'success');

        $this->assertSoftDeleted('testimonials', ['id' => $testimonial->id]);
    }

    public function test_store_rejeita_campos_invalidos(): void
    {
        $user = $this->adminUser(['testimonials.create']);

        $this->actingAs($user)
            ->post(route('admin.testimonials.store'), [
                'name' => '',
                'role' => '',
                'content' => '',
            ])
            ->assertSessionHasErrors(['name', 'role', 'content']);
    }

    public function test_store_faz_upload_de_avatar(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['testimonials.create']);
        $avatar = UploadedFile::fake()->create('avatar.png', 50, 'image/png');

        $this->actingAs($user)
            ->post(route('admin.testimonials.store'), [
                'name' => 'Ana Oliveira',
                'role' => 'Designer',
                'content' => 'Adorei o conteúdo!',
                'is_active' => true,
                'avatar_image' => $avatar,
            ])
            ->assertRedirect(route('admin.testimonials.index'));

        $testimonial = Testimonial::where('name', 'Ana Oliveira')->first();
        $this->assertNotNull($testimonial->avatar_image);
        Storage::disk('public')->assertExists($testimonial->avatar_image);
    }

    public function test_update_troca_avatar_e_deleta_antigo(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['testimonials.edit']);

        $oldPath = 'testimonials/old-avatar.png';
        Storage::disk('public')->put($oldPath, 'antigo');
        $testimonial = Testimonial::factory()->create([
            'avatar_image' => $oldPath,
        ]);

        $newAvatar = UploadedFile::fake()->create('new-avatar.png', 50, 'image/png');

        $this->actingAs($user)
            ->put(route('admin.testimonials.update', $testimonial), [
                'name' => $testimonial->name,
                'role' => $testimonial->role,
                'content' => $testimonial->content,
                'is_active' => true,
                'avatar_image' => $newAvatar,
            ]);

        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($testimonial->fresh()->avatar_image);
    }

    public function test_destroy_remove_arquivo_de_avatar(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['testimonials.delete']);

        $avatarPath = 'testimonials/avatar.png';
        Storage::disk('public')->put($avatarPath, 'avatar');

        $testimonial = Testimonial::factory()->create(['avatar_image' => $avatarPath]);

        $this->actingAs($user)
            ->delete(route('admin.testimonials.destroy', $testimonial));

        $this->assertSoftDeleted('testimonials', ['id' => $testimonial->id]);
        Storage::disk('public')->assertMissing($avatarPath);
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.testimonials.index'))
            ->assertRedirect(route('login'));
    }

    public function test_restore_perde_avatar_bug_tt2(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['testimonials.delete']);
        $avatarPath = 'testimonials/avatar.png';
        Storage::disk('public')->put($avatarPath, 'avatar');
        $testimonial = Testimonial::factory()->create(['avatar_image' => $avatarPath]);

        $this->actingAs($user)
            ->delete(route('admin.testimonials.destroy', $testimonial));

        $this->assertSoftDeleted('testimonials', ['id' => $testimonial->id]);

        // Bug TT-2: arquivo é deletado junto com o soft-delete; ao restaurar, a imagem não existe mais
        $testimonial->restore();
        Storage::disk('public')->assertMissing($avatarPath);
    }
}
