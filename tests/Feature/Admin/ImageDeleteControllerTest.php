<?php

namespace Tests\Feature\Admin;

use App\Models\Page;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class ImageDeleteControllerTest extends TestCase
{
    use CreatesAdminUser, RefreshDatabase;

    public function test_remove_banner_de_post(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['posts.edit']);

        $path = 'posts/banner.jpg';
        Storage::disk('public')->put($path, 'imagem');
        $post = Post::factory()->create(['banner_image' => $path]);

        $this->actingAs($user)
            ->delete(route('admin.image.destroy'), [
                'model' => 'post',
                'id' => $post->id,
                'field' => 'banner_image',
            ])
            ->assertRedirect();

        Storage::disk('public')->assertMissing($path);
        $this->assertNull($post->fresh()->banner_image);
    }

    public function test_remove_banner_de_page(): void
    {
        Storage::fake('public');
        $user = $this->adminUser(['pages.edit']);

        $path = 'pages/banner.jpg';
        Storage::disk('public')->put($path, 'imagem');
        $page = Page::create(['title' => 'Sobre', 'banner_image' => $path, 'is_active' => true]);

        $this->actingAs($user)
            ->delete(route('admin.image.destroy'), [
                'model' => 'page',
                'id' => $page->id,
                'field' => 'banner_image',
            ])
            ->assertRedirect();

        Storage::disk('public')->assertMissing($path);
        $this->assertNull($page->fresh()->banner_image);
    }

    public function test_rejeita_model_invalido(): void
    {
        $user = $this->adminUser(['posts.edit']);

        $this->actingAs($user)
            ->delete(route('admin.image.destroy'), [
                'model' => 'invalido',
                'id' => 1,
                'field' => 'banner_image',
            ])
            ->assertSessionHas('toast.type', 'error');
    }

    public function test_rejeita_field_nao_permitido(): void
    {
        $user = $this->adminUser(['posts.edit']);
        $post = Post::factory()->create();

        $this->actingAs($user)
            ->delete(route('admin.image.destroy'), [
                'model' => 'post',
                'id' => $post->id,
                'field' => 'title',
            ])
            ->assertSessionHas('toast.type', 'error');
    }

    public function test_sem_permissao_redireciona_com_erro(): void
    {
        $user = $this->adminUser([]);
        $post = Post::factory()->create(['banner_image' => 'posts/banner.jpg']);

        $this->actingAs($user)
            ->delete(route('admin.image.destroy'), [
                'model' => 'post',
                'id' => $post->id,
                'field' => 'banner_image',
            ])
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'error');
    }

    public function test_item_sem_imagem_redireciona_sem_erro(): void
    {
        $user = $this->adminUser(['posts.edit']);
        $post = Post::factory()->create(['banner_image' => null]);

        $this->actingAs($user)
            ->delete(route('admin.image.destroy'), [
                'model' => 'post',
                'id' => $post->id,
                'field' => 'banner_image',
            ])
            ->assertRedirect();
    }
}
