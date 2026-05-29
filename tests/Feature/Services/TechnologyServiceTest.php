<?php

namespace Tests\Feature\Services;

use App\Models\Technology;
use App\Services\FileUploadService;
use App\Services\TechnologyService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TechnologyServiceTest extends TestCase
{
    use RefreshDatabase;

    private function makeService(): TechnologyService
    {
        return new TechnologyService(app(FileUploadService::class));
    }

    public function test_create_sem_imagens_salva_tecnologia(): void
    {
        $service = $this->makeService();

        $tech = $service->create(['name' => 'Laravel', 'url' => 'https://laravel.com', 'is_active' => true]);

        $this->assertInstanceOf(Technology::class, $tech);
        $this->assertDatabaseHas('technologies', ['name' => 'Laravel', 'icon_image' => null, 'screenshot_image' => null]);
    }

    public function test_create_faz_upload_de_icon(): void
    {
        Storage::fake('public');
        $service = $this->makeService();

        $icon = UploadedFile::fake()->create('icon.png', 50, 'image/png');
        $tech = $service->create(['name' => 'Vue', 'url' => 'https://vuejs.org', 'is_active' => true], $icon);

        $this->assertNotNull($tech->icon_image);
        Storage::disk('public')->assertExists($tech->icon_image);
        $this->assertNull($tech->screenshot_image);
    }

    public function test_create_faz_upload_de_screenshot(): void
    {
        Storage::fake('public');
        $service = $this->makeService();

        $screenshot = UploadedFile::fake()->create('screenshot.jpg', 200, 'image/jpeg');
        $tech = $service->create(['name' => 'React', 'url' => 'https://react.dev', 'is_active' => true], null, $screenshot);

        $this->assertNull($tech->icon_image);
        $this->assertNotNull($tech->screenshot_image);
        Storage::disk('public')->assertExists($tech->screenshot_image);
    }

    public function test_create_faz_upload_de_icon_e_screenshot(): void
    {
        Storage::fake('public');
        $service = $this->makeService();

        $icon = UploadedFile::fake()->create('icon.png', 50, 'image/png');
        $screenshot = UploadedFile::fake()->create('screenshot.jpg', 200, 'image/jpeg');
        $tech = $service->create(['name' => 'Node', 'url' => 'https://nodejs.org', 'is_active' => true], $icon, $screenshot);

        $this->assertNotNull($tech->icon_image);
        $this->assertNotNull($tech->screenshot_image);
        Storage::disk('public')->assertExists($tech->icon_image);
        Storage::disk('public')->assertExists($tech->screenshot_image);
    }

    public function test_update_troca_icon_e_deleta_antigo(): void
    {
        Storage::fake('public');
        $oldPath = 'technologies/old-icon.png';
        Storage::disk('public')->put($oldPath, 'antigo');
        $tech = Technology::create(['name' => 'PHP', 'url' => 'https://php.net', 'icon_image' => $oldPath, 'is_active' => true]);

        $service = $this->makeService();
        $newIcon = UploadedFile::fake()->create('new-icon.png', 50, 'image/png');
        $service->update($tech, ['name' => 'PHP', 'url' => 'https://php.net', 'is_active' => true], $newIcon);

        Storage::disk('public')->assertMissing($oldPath);
        $this->assertNotSame($oldPath, $tech->fresh()->icon_image);
        Storage::disk('public')->assertExists($tech->fresh()->icon_image);
    }

    public function test_update_troca_screenshot_e_deleta_antigo(): void
    {
        Storage::fake('public');
        $oldPath = 'technologies/old-screenshot.jpg';
        Storage::disk('public')->put($oldPath, 'antigo');
        $tech = Technology::create(['name' => 'PHP', 'url' => 'https://php.net', 'screenshot_image' => $oldPath, 'is_active' => true]);

        $service = $this->makeService();
        $newShot = UploadedFile::fake()->create('new-screenshot.jpg', 200, 'image/jpeg');
        $service->update($tech, ['name' => 'PHP', 'url' => 'https://php.net', 'is_active' => true], null, $newShot);

        Storage::disk('public')->assertMissing($oldPath);
        $this->assertNotSame($oldPath, $tech->fresh()->screenshot_image);
        Storage::disk('public')->assertExists($tech->fresh()->screenshot_image);
    }

    public function test_update_sem_novos_arquivos_mantem_existentes(): void
    {
        Storage::fake('public');
        $iconPath = 'technologies/keep-icon.png';
        $shotPath = 'technologies/keep-screenshot.jpg';
        Storage::disk('public')->put($iconPath, 'icon');
        Storage::disk('public')->put($shotPath, 'screenshot');
        $tech = Technology::create([
            'name' => 'PHP', 'url' => 'https://php.net',
            'icon_image' => $iconPath, 'screenshot_image' => $shotPath, 'is_active' => true,
        ]);

        $service = $this->makeService();
        $service->update($tech, ['name' => 'PHP 8', 'url' => 'https://php.net', 'is_active' => true]);

        Storage::disk('public')->assertExists($iconPath);
        Storage::disk('public')->assertExists($shotPath);
        $this->assertSame($iconPath, $tech->fresh()->icon_image);
        $this->assertSame($shotPath, $tech->fresh()->screenshot_image);
    }

    public function test_delete_remove_tecnologia_e_arquivos(): void
    {
        Storage::fake('public');
        $iconPath = 'technologies/icon.png';
        $shotPath = 'technologies/screenshot.jpg';
        Storage::disk('public')->put($iconPath, 'icon');
        Storage::disk('public')->put($shotPath, 'screenshot');
        $tech = Technology::create([
            'name' => 'PHP', 'url' => 'https://php.net',
            'icon_image' => $iconPath, 'screenshot_image' => $shotPath, 'is_active' => true,
        ]);

        $service = $this->makeService();
        $service->delete($tech);

        $this->assertDatabaseMissing('technologies', ['id' => $tech->id]);
        Storage::disk('public')->assertMissing($iconPath);
        Storage::disk('public')->assertMissing($shotPath);
    }

    public function test_delete_sem_imagens_nao_gera_erro(): void
    {
        $tech = Technology::create(['name' => 'CLI', 'url' => 'https://exemplo.com', 'is_active' => true]);
        $service = $this->makeService();

        $service->delete($tech);

        $this->assertDatabaseMissing('technologies', ['id' => $tech->id]);
    }
}
