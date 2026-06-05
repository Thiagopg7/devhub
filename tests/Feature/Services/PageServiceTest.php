<?php

namespace Tests\Feature\Services;

use App\Models\Page;
use App\Services\FileUploadService;
use App\Services\PageService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PageServiceTest extends TestCase
{
    use RefreshDatabase;

    private function makeService(): PageService
    {
        return new PageService(app(FileUploadService::class));
    }

    public function test_create_sem_imagem_salva_pagina(): void
    {
        $service = $this->makeService();
        $page = $service->create(['title' => 'Sobre', 'is_active' => true], null);

        $this->assertInstanceOf(Page::class, $page);
        $this->assertDatabaseHas('pages', ['title' => 'Sobre', 'main_image' => null]);
    }

    public function test_create_faz_upload_da_imagem_principal(): void
    {
        Storage::fake('public');
        $service = $this->makeService();
        $mainImage = UploadedFile::fake()->create('main.jpg', 512, 'image/jpeg');

        $page = $service->create(['title' => 'Portfólio', 'is_active' => true], $mainImage);

        $this->assertNotNull($page->main_image);
        Storage::disk('public')->assertExists($page->main_image);
    }

    public function test_update_troca_imagem_principal_e_deleta_antiga(): void
    {
        Storage::fake('public');
        $oldPath = 'pages/old-main.jpg';
        Storage::disk('public')->put($oldPath, 'antigo');
        $page = Page::create(['title' => 'Página', 'main_image' => $oldPath, 'is_active' => true]);
        $service = $this->makeService();

        $newMain = UploadedFile::fake()->create('new-main.jpg', 512, 'image/jpeg');
        $service->update($page, ['title' => 'Página'], $newMain);

        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($page->fresh()->main_image);
    }

    public function test_update_sem_nova_imagem_mantem_existente(): void
    {
        Storage::fake('public');
        $mainPath = 'pages/main.jpg';
        Storage::disk('public')->put($mainPath, 'm');
        $page = Page::create(['title' => 'Página', 'main_image' => $mainPath, 'is_active' => true]);
        $service = $this->makeService();

        $service->update($page, ['title' => 'Atualizada'], null);

        Storage::disk('public')->assertExists($mainPath);
        $this->assertSame($mainPath, $page->fresh()->main_image);
    }

    public function test_delete_aplica_soft_delete(): void
    {
        $service = $this->makeService();
        $page = Page::create(['title' => 'Remover', 'is_active' => true]);

        $service->delete($page);

        $this->assertSoftDeleted('pages', ['id' => $page->id]);
    }

    public function test_purge_remove_arquivo_e_exclui_permanentemente(): void
    {
        Storage::fake('public');
        $mainPath = 'pages/main.jpg';
        Storage::disk('public')->put($mainPath, 'm');
        $page = Page::create(['title' => 'Purgar', 'main_image' => $mainPath, 'is_active' => true]);
        $service = $this->makeService();

        $service->purge($page);

        $this->assertDatabaseMissing('pages', ['id' => $page->id]);
        Storage::disk('public')->assertMissing($mainPath);
    }

    public function test_get_paginated_retorna_paginacao(): void
    {
        Page::create(['title' => 'Página A', 'is_active' => true]);
        Page::create(['title' => 'Página B', 'is_active' => true]);
        $service = $this->makeService();

        $result = $service->getPaginated(1);

        $this->assertSame(1, $result->perPage());
        $this->assertSame(2, $result->total());
    }

    public function test_get_paginated_filtra_por_busca(): void
    {
        Page::create(['title' => 'Sobre Nós', 'is_active' => true]);
        Page::create(['title' => 'Contato', 'is_active' => true]);
        $service = $this->makeService();

        $result = $service->getPaginated(20, 'Sobre');

        $this->assertSame(1, $result->total());
    }
}
