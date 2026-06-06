<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitemapTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_retorna_xml_apenas_com_conteudo_publico(): void
    {
        $publicado = Post::factory()->create();
        $agendado = Post::factory()->scheduled()->create();
        $categoria = Category::create(['name' => 'Tecnologia', 'color' => '#000', 'is_active' => true]);
        $visivel = Page::create(['title' => 'Pagina Visivel', 'slug' => 'pagina-visivel', 'is_active' => true, 'is_searchable' => true]);
        $oculta = Page::create(['title' => 'Pagina Oculta', 'slug' => 'pagina-oculta', 'is_active' => true, 'is_searchable' => false]);

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml');

        $response->assertSee($publicado->slug, false);    // post publicado entra
        $response->assertDontSee($agendado->slug, false); // post agendado não entra
        $response->assertSee($categoria->slug, false);    // categoria ativa entra
        $response->assertSee($visivel->slug, false);      // página pesquisável entra
        $response->assertDontSee($oculta->slug, false);   // página não pesquisável não entra
    }
}
