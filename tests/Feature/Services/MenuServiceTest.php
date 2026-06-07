<?php

namespace Tests\Feature\Services;

use App\Models\MenuItem;
use App\Services\MenuService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class MenuServiceTest extends TestCase
{
    use RefreshDatabase;

    private function makeService(): MenuService
    {
        return app(MenuService::class);
    }

    private function makeItem(array $attrs = []): MenuItem
    {
        return MenuItem::create(array_merge([
            'label' => 'Item',
            'url' => '/teste',
            'is_active' => true,
        ], $attrs));
    }

    public function test_get_public_tree_retorna_apenas_raizes_ativas(): void
    {
        $this->makeItem(['label' => 'Ativo', 'is_active' => true]);
        $this->makeItem(['label' => 'Inativo', 'is_active' => false]);

        $tree = $this->makeService()->getPublicTree();

        $this->assertCount(1, $tree);
        $this->assertSame('Ativo', $tree[0]['label']);
    }

    public function test_get_public_tree_filtra_filhos_inativos(): void
    {
        $parent = $this->makeItem(['label' => 'Pai']);
        $this->makeItem(['label' => 'Filho Ativo', 'parent_id' => $parent->id, 'is_active' => true]);
        $this->makeItem(['label' => 'Filho Inativo', 'parent_id' => $parent->id, 'is_active' => false]);

        $tree = $this->makeService()->getPublicTree();

        $this->assertCount(1, $tree[0]['children']);
        $this->assertSame('Filho Ativo', $tree[0]['children'][0]['label']);
    }

    public function test_get_public_tree_usa_cache_na_segunda_chamada(): void
    {
        Cache::flush();
        $this->makeItem(['label' => 'Real']);
        $service = $this->makeService();

        // Primeira chamada popula o cache
        $first = $service->getPublicTree();

        // Substitui o cache por um valor conhecido para provar que a segunda
        // chamada o lê em vez de consultar o banco
        Cache::forever('menu.shared', [['label' => 'Cached', 'is_active' => true, 'children' => []]]);

        $second = $service->getPublicTree();

        $this->assertCount(1, $first);
        $this->assertSame('Cached', $second[0]['label']);
    }

    public function test_create_invalida_cache(): void
    {
        Cache::put('menu.shared', [['label' => 'Stale']], 3600);

        $this->makeService()->create(['label' => 'Novo', 'url' => '/novo', 'is_active' => true]);

        $this->assertNull(Cache::get('menu.shared'));
    }

    public function test_update_invalida_cache(): void
    {
        $item = $this->makeItem();
        Cache::put('menu.shared', [['label' => 'Stale']], 3600);

        $this->makeService()->update($item, ['label' => 'Atualizado', 'url' => '/novo', 'is_active' => true]);

        $this->assertNull(Cache::get('menu.shared'));
    }

    public function test_delete_invalida_cache(): void
    {
        $item = $this->makeItem();
        Cache::put('menu.shared', [['label' => 'Stale']], 3600);

        $this->makeService()->delete($item);

        $this->assertNull(Cache::get('menu.shared'));
    }

    public function test_get_admin_list_retorna_raizes_com_filhos_em_ordem(): void
    {
        $parent = $this->makeItem(['label' => 'Pai']);
        $this->makeItem(['label' => 'Filho B', 'parent_id' => $parent->id, 'order' => 2]);
        $this->makeItem(['label' => 'Filho A', 'parent_id' => $parent->id, 'order' => 1]);

        $list = $this->makeService()->getAdminList();

        $this->assertCount(1, $list);
        $this->assertSame('Filho A', $list->first()->children[0]->label);
        $this->assertSame('Filho B', $list->first()->children[1]->label);
    }

    public function test_get_admin_list_filtra_por_busca(): void
    {
        $this->makeItem(['label' => 'Sobre nós']);
        $this->makeItem(['label' => 'Contato']);

        $result = $this->makeService()->getAdminList('Sobre');

        $this->assertCount(1, $result);
        $this->assertSame('Sobre nós', $result->first()->label);
    }
}
