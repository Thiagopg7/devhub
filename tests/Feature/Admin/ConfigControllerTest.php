<?php

namespace Tests\Feature\Admin;

use App\Models\Config;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class ConfigControllerTest extends TestCase
{
    use CreatesAdminUser, RefreshDatabase;

    public function test_edit_renderiza_formulario(): void
    {
        $user = $this->adminUser(['configs.view']);

        $this->actingAs($user)
            ->get(route('admin.configs.edit'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Configs/Form')
                ->has('values')
            );
    }

    public function test_update_salva_configuracoes(): void
    {
        $user = $this->adminUser(['configs.edit']);

        $this->actingAs($user)
            ->put(route('admin.configs.update'), [
                'config' => [
                    'site_name' => 'Meu Portfólio',
                    'site_tagline' => 'Dev PHP',
                ],
            ])
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'success');

        $this->assertSame('Meu Portfólio', Config::getValue('site_name'));
        $this->assertSame('Dev PHP', Config::getValue('site_tagline'));
    }

    public function test_update_aceita_valores_nulos(): void
    {
        $user = $this->adminUser(['configs.edit']);
        Config::setValue('site_name', 'Antigo', 'general');

        $this->actingAs($user)
            ->put(route('admin.configs.update'), [
                'config' => ['site_name' => ''],
            ])
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'success');

        $this->assertNull(Config::getValue('site_name'));
    }

    public function test_update_rejeita_email_invalido(): void
    {
        $user = $this->adminUser(['configs.edit']);

        $this->actingAs($user)
            ->put(route('admin.configs.update'), [
                'config' => ['contact_email' => 'nao-é-um-email'],
            ])
            ->assertSessionHasErrors('config.contact_email');
    }

    public function test_update_rejeita_url_invalida(): void
    {
        $user = $this->adminUser(['configs.edit']);

        $this->actingAs($user)
            ->put(route('admin.configs.update'), [
                'config' => ['footer_facebook' => 'nao-é-uma-url'],
            ])
            ->assertSessionHasErrors('config.footer_facebook');
    }

    public function test_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.configs.edit'))
            ->assertRedirect(route('login'));
    }

    public function test_sem_permissao_view_redireciona_para_dashboard(): void
    {
        $user = $this->adminUser([]);

        $this->actingAs($user)
            ->get(route('admin.configs.edit'))
            ->assertRedirect(route('admin.dashboard'));
    }
}
