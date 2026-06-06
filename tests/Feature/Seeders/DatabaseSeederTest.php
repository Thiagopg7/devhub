<?php

namespace Tests\Feature\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\Technology;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seed_popula_o_conteudo_canonico(): void
    {
        Storage::fake('public');

        $this->seed(DatabaseSeeder::class);

        $this->assertSame(6, Category::count());
        $this->assertSame(8, Technology::count());
        $this->assertGreaterThan(0, Post::count());
        $this->assertSame(1, Post::where('is_featured', true)->count());
        $this->assertSame(2, User::count());
    }

    public function test_seed_e_idempotente(): void
    {
        Storage::fake('public');

        $this->seed(DatabaseSeeder::class);
        $antes = [
            'posts' => Post::count(),
            'categories' => Category::count(),
            'technologies' => Technology::count(),
            'users' => User::count(),
        ];

        // Rodar de novo não pode duplicar nada (firstOrCreate).
        $this->seed(DatabaseSeeder::class);

        $this->assertSame($antes['posts'], Post::count());
        $this->assertSame($antes['categories'], Category::count());
        $this->assertSame($antes['technologies'], Technology::count());
        $this->assertSame($antes['users'], User::count());
    }
}
