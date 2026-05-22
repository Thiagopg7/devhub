<?php

namespace Tests\Feature\Services;

use App\Models\Post;
use App\Models\User;
use App\Services\FileUploadService;
use App\Services\PostService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostServiceTest extends TestCase
{
    use RefreshDatabase;

    private function makeService(?FileUploadService $uploadService = null): PostService
    {
        return new PostService($uploadService ?? app(FileUploadService::class));
    }

    private function author(): User
    {
        return User::factory()->create();
    }

    public function test_create_sem_banner_salva_post(): void
    {
        $author  = $this->author();
        $service = $this->makeService();

        $post = $service->create([
            'title'   => 'Sem banner',
            'user_id' => $author->id,
        ]);

        $this->assertInstanceOf(Post::class, $post);
        $this->assertDatabaseHas('posts', ['title' => 'Sem banner', 'banner_image' => null]);
    }

    public function test_create_faz_upload_do_banner(): void
    {
        Storage::fake('public');
        $author  = $this->author();
        $service = $this->makeService();

        $file = UploadedFile::fake()->create('banner.jpg', 512, 'image/jpeg');
        $post = $service->create(['title' => 'Com banner', 'user_id' => $author->id], $file);

        $this->assertNotNull($post->banner_image);
        Storage::disk('public')->assertExists($post->banner_image);
    }

    public function test_update_troca_banner_deleta_antigo_apos_salvar(): void
    {
        Storage::fake('public');
        $author = $this->author();

        $oldPath = 'posts/old.jpg';
        Storage::disk('public')->put($oldPath, 'antigo');
        $post = Post::factory()->create(['user_id' => $author->id, 'banner_image' => $oldPath]);

        $service   = $this->makeService();
        $newBanner = UploadedFile::fake()->create('new.jpg', 512, 'image/jpeg');

        $service->update($post, ['title' => $post->title], $newBanner);

        // Arquivo antigo removido
        Storage::disk('public')->assertMissing($oldPath);

        // Novo arquivo salvo
        $this->assertNotSame($oldPath, $post->fresh()->banner_image);
        Storage::disk('public')->assertExists($post->fresh()->banner_image);
    }

    public function test_update_sem_novo_banner_mantem_existente(): void
    {
        Storage::fake('public');
        $author = $this->author();

        $existingPath = 'posts/keep.jpg';
        Storage::disk('public')->put($existingPath, 'imagem');
        $post = Post::factory()->create(['user_id' => $author->id, 'banner_image' => $existingPath]);

        $service = $this->makeService();
        $service->update($post, ['title' => 'Título atualizado']);

        Storage::disk('public')->assertExists($existingPath);
        $this->assertSame($existingPath, $post->fresh()->banner_image);
    }

    public function test_update_sem_banner_anterior_nao_tenta_deletar(): void
    {
        Storage::fake('public');
        $author = $this->author();
        $post   = Post::factory()->create(['user_id' => $author->id, 'banner_image' => null]);

        $service   = $this->makeService();
        $newBanner = UploadedFile::fake()->create('first.jpg', 512, 'image/jpeg');

        $service->update($post, ['title' => $post->title], $newBanner);

        $this->assertNotNull($post->fresh()->banner_image);
        Storage::disk('public')->assertExists($post->fresh()->banner_image);
    }

    public function test_delete_remove_post_com_soft_delete(): void
    {
        $author  = $this->author();
        $post    = Post::factory()->create(['user_id' => $author->id]);
        $service = $this->makeService();

        $service->delete($post);

        $this->assertSoftDeleted('posts', ['id' => $post->id]);
    }
}
