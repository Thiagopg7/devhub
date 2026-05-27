<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class PostControllerTest extends TestCase
{
    use CreatesAdminUser;

    use RefreshDatabase;

    public function test_index_lista_posts(): void
    {
        $user = $this->adminUser(['posts.view']);
        Post::factory()->create(['title' => 'Meu post']);

        $this->actingAs($user)
            ->get(route('admin.posts.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Posts/Index')
                ->has('posts.data')
            );
    }

    public function test_create_renderiza_formulario(): void
    {
        $user = $this->adminUser(['posts.create']);

        $this->actingAs($user)
            ->get(route('admin.posts.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Posts/Form')
                ->has('categories')
            );
    }

    public function test_store_cria_post(): void
    {
        $user = $this->adminUser(['posts.create']);

        $this->actingAs($user)
            ->post(route('admin.posts.store'), [
                'title'     => 'Post de Teste',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.posts.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('posts', ['title' => 'Post de Teste']);
    }

    public function test_store_atribui_user_id_do_usuario_autenticado(): void
    {
        $user = $this->adminUser(['posts.create']);

        $this->actingAs($user)
            ->post(route('admin.posts.store'), [
                'title'     => 'Post com autor',
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('posts', [
            'title'   => 'Post com autor',
            'user_id' => $user->id,
        ]);
    }

    public function test_store_faz_upload_do_banner(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['posts.create']);

        $banner = UploadedFile::fake()->create('banner.jpg', 512, 'image/jpeg');

        $this->actingAs($user)
            ->post(route('admin.posts.store'), [
                'title'        => 'Post com banner',
                'banner_image' => $banner,
                'is_active'    => true,
            ])
            ->assertRedirect(route('admin.posts.index'));

        $post = Post::where('title', 'Post com banner')->firstOrFail();
        $this->assertNotNull($post->banner_image);
        Storage::disk('public')->assertExists($post->banner_image);
    }

    public function test_edit_renderiza_formulario(): void
    {
        $user = $this->adminUser(['posts.view']);
        $post = Post::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.posts.edit', $post))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Posts/Form')
                ->has('post')
                ->has('categories')
            );
    }

    public function test_update_atualiza_post(): void
    {
        $user = $this->adminUser(['posts.edit']);
        $post = Post::factory()->create(['title' => 'Antigo']);

        $this->actingAs($user)
            ->put(route('admin.posts.update', $post), [
                'title'     => 'Atualizado',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.posts.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('posts', ['id' => $post->id, 'title' => 'Atualizado']);
    }

    public function test_update_troca_banner_e_remove_antigo(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['posts.edit']);

        $oldPath = 'posts/old-banner.jpg';
        Storage::disk('public')->put($oldPath, 'antigo');
        $post = Post::factory()->create(['banner_image' => $oldPath]);

        $newBanner = UploadedFile::fake()->create('new-banner.jpg', 512, 'image/jpeg');

        $this->actingAs($user)
            ->put(route('admin.posts.update', $post), [
                'title'        => $post->title,
                'banner_image' => $newBanner,
                'is_active'    => true,
            ])
            ->assertRedirect(route('admin.posts.index'));

        Storage::disk('public')->assertMissing($oldPath);
        $this->assertNotSame($oldPath, $post->fresh()->banner_image);
    }

    public function test_update_sem_novo_banner_mantem_existente(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['posts.edit']);

        $existingPath = 'posts/existing.jpg';
        Storage::disk('public')->put($existingPath, 'imagem');
        $post = Post::factory()->create(['banner_image' => $existingPath]);

        $this->actingAs($user)
            ->put(route('admin.posts.update', $post), [
                'title'     => 'Sem trocar banner',
                'is_active' => true,
            ]);

        Storage::disk('public')->assertExists($existingPath);
        $this->assertSame($existingPath, $post->fresh()->banner_image);
    }

    public function test_destroy_remove_post(): void
    {
        $user = $this->adminUser(['posts.delete']);
        $post = Post::factory()->create();

        $this->actingAs($user)
            ->delete(route('admin.posts.destroy', $post))
            ->assertRedirect(route('admin.posts.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertSoftDeleted('posts', ['id' => $post->id]);
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.posts.index'))
            ->assertRedirect(route('login'));
    }

    public function test_sem_permissao_redireciona_para_dashboard(): void
    {
        $user = $this->adminUser([]);

        $this->actingAs($user)
            ->get(route('admin.posts.index'))
            ->assertRedirect(route('admin.dashboard'));
    }

    public function test_store_com_categoria_valida(): void
    {
        $user     = $this->adminUser(['posts.create']);
        $category = Category::create(['name' => 'Tech', 'color' => '#000000', 'is_active' => true]);

        $this->actingAs($user)
            ->post(route('admin.posts.store'), [
                'title'       => 'Post categorizado',
                'category_id' => $category->id,
                'is_active'   => true,
            ])
            ->assertRedirect(route('admin.posts.index'));

        $this->assertDatabaseHas('posts', ['title' => 'Post categorizado', 'category_id' => $category->id]);
    }
}
