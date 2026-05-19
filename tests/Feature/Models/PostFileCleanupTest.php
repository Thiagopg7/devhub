<?php

namespace Tests\Feature\Models;

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostFileCleanupTest extends TestCase
{
    use RefreshDatabase;

    public function test_soft_delete_preserva_arquivo(): void
    {
        Storage::fake('public');
        $path = 'posts/banner.jpg';
        Storage::disk('public')->put($path, 'fake');

        $post = Post::factory()->create(['banner_image' => $path]);

        $post->delete();

        Storage::disk('public')->assertExists($path);
        $this->assertSoftDeleted($post);
    }

    public function test_force_delete_apaga_arquivo(): void
    {
        Storage::fake('public');
        $path = 'posts/banner.jpg';
        Storage::disk('public')->put($path, 'fake');

        $post = Post::factory()->create(['banner_image' => $path]);

        $post->forceDelete();

        Storage::disk('public')->assertMissing($path);
    }

    public function test_force_delete_sem_arquivo_nao_quebra(): void
    {
        Storage::fake('public');

        $post = Post::factory()->create(['banner_image' => null]);

        $post->forceDelete();

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }
}
