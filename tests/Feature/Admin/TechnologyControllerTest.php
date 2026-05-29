<?php

namespace Tests\Feature\Admin;

use App\Models\Technology;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class TechnologyControllerTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_index_lista_tecnologias(): void
    {
        $user = $this->adminUser(['technologies.view']);
        Technology::create(['name' => 'Laravel', 'url' => 'https://laravel.com', 'is_active' => true]);

        $this->actingAs($user)
            ->get(route('admin.technologies.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Technologies/Index')
                ->has('technologies.data')
            );
    }

    public function test_store_cria_tecnologia(): void
    {
        $user = $this->adminUser(['technologies.create']);

        $this->actingAs($user)
            ->post(route('admin.technologies.store'), [
                'name' => 'Vue.js',
                'url' => 'https://vuejs.org',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.technologies.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('technologies', ['name' => 'Vue.js']);
    }

    public function test_store_define_order_automaticamente(): void
    {
        $user = $this->adminUser(['technologies.create']);
        Technology::create(['name' => 'A', 'url' => 'https://a.com', 'order' => 1]);

        $this->actingAs($user)
            ->post(route('admin.technologies.store'), [
                'name' => 'B',
                'url' => 'https://b.com',
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('technologies', ['name' => 'B', 'order' => 2]);
    }

    public function test_update_atualiza_tecnologia(): void
    {
        $user = $this->adminUser(['technologies.edit']);
        $tech = Technology::create(['name' => 'React', 'url' => 'https://react.dev', 'is_active' => true]);

        $this->actingAs($user)
            ->put(route('admin.technologies.update', $tech), [
                'name' => 'React 19',
                'url' => 'https://react.dev',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.technologies.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('technologies', ['id' => $tech->id, 'name' => 'React 19']);
    }

    public function test_destroy_remove_tecnologia(): void
    {
        $user = $this->adminUser(['technologies.delete']);
        $tech = Technology::create(['name' => 'Removida', 'url' => 'https://x.com', 'is_active' => true]);

        $this->actingAs($user)
            ->delete(route('admin.technologies.destroy', $tech))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseMissing('technologies', ['id' => $tech->id]);
    }

    public function test_store_faz_upload_de_icon_image(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['technologies.create']);

        $icon = UploadedFile::fake()->create('icon.png', 50, 'image/png');

        $this->actingAs($user)
            ->post(route('admin.technologies.store'), [
                'name' => 'Docker',
                'url' => 'https://docker.com',
                'is_active' => true,
                'icon_image' => $icon,
            ])
            ->assertRedirect(route('admin.technologies.index'));

        $tech = Technology::where('name', 'Docker')->first();
        $this->assertNotNull($tech->icon_image);
        Storage::disk('public')->assertExists($tech->icon_image);
    }

    public function test_store_faz_upload_de_screenshot_image(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['technologies.create']);

        $screenshot = UploadedFile::fake()->create('screenshot.jpg', 200, 'image/jpeg');

        $this->actingAs($user)
            ->post(route('admin.technologies.store'), [
                'name' => 'Redis',
                'url' => 'https://redis.io',
                'is_active' => true,
                'screenshot_image' => $screenshot,
            ])
            ->assertRedirect(route('admin.technologies.index'));

        $tech = Technology::where('name', 'Redis')->first();
        $this->assertNotNull($tech->screenshot_image);
        Storage::disk('public')->assertExists($tech->screenshot_image);
    }

    public function test_update_troca_icon_e_deleta_arquivo_antigo(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['technologies.edit']);

        $oldPath = 'technologies/old-icon.png';
        Storage::disk('public')->put($oldPath, 'antigo');
        $tech = Technology::create([
            'name' => 'MySQL', 'url' => 'https://mysql.com',
            'icon_image' => $oldPath, 'is_active' => true,
        ]);

        $newIcon = UploadedFile::fake()->create('new-icon.png', 50, 'image/png');

        $this->actingAs($user)
            ->put(route('admin.technologies.update', $tech), [
                'name' => 'MySQL',
                'url' => 'https://mysql.com',
                'is_active' => true,
                'icon_image' => $newIcon,
            ]);

        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($tech->fresh()->icon_image);
    }

    public function test_destroy_remove_arquivos_de_imagem(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['technologies.delete']);

        $iconPath = 'technologies/icon.png';
        $shotPath = 'technologies/screenshot.jpg';
        Storage::disk('public')->put($iconPath, 'icon');
        Storage::disk('public')->put($shotPath, 'screenshot');

        $tech = Technology::create([
            'name' => 'Removida', 'url' => 'https://x.com',
            'icon_image' => $iconPath, 'screenshot_image' => $shotPath, 'is_active' => true,
        ]);

        $this->actingAs($user)
            ->delete(route('admin.technologies.destroy', $tech));

        $this->assertDatabaseMissing('technologies', ['id' => $tech->id]);
        Storage::disk('public')->assertMissing($iconPath);
        Storage::disk('public')->assertMissing($shotPath);
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.technologies.index'))
            ->assertRedirect(route('login'));
    }
}
