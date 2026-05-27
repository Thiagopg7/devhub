<?php

namespace Tests\Feature\Admin;

use App\Jobs\SendNewsletterCampaign;
use App\Models\NewsletterCampaign;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class NewsletterCampaignControllerTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    private function campaign(array $attrs = []): NewsletterCampaign
    {
        return NewsletterCampaign::create(array_merge([
            'title'   => 'Campanha Teste',
            'subject' => 'Assunto Teste',
            'status'  => 'draft',
        ], $attrs));
    }

    // --- index ---

    public function test_index_lista_campanhas(): void
    {
        $user = $this->adminUser(['newsletter_campaigns.view']);
        $this->campaign();

        $this->actingAs($user)
            ->get(route('admin.newsletter-campaigns.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/NewsletterCampaigns/Index')
                ->has('campaigns.data')
            );
    }

    // --- create ---

    public function test_create_renderiza_formulario_com_posts(): void
    {
        $user = $this->adminUser(['newsletter_campaigns.create']);
        Post::factory()->create(['is_active' => true]);

        $this->actingAs($user)
            ->get(route('admin.newsletter-campaigns.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/NewsletterCampaigns/Form')
                ->has('posts')
            );
    }

    // --- store ---

    public function test_store_cria_campanha_rascunho(): void
    {
        $user = $this->adminUser(['newsletter_campaigns.create']);
        $post = Post::factory()->create(['is_active' => true]);

        $this->actingAs($user)
            ->post(route('admin.newsletter-campaigns.store'), [
                'title'    => 'Nova Campanha',
                'subject'  => 'Assunto do e-mail',
                'post_ids' => [$post->id],
            ])
            ->assertRedirect(route('admin.newsletter-campaigns.index'));

        $campaign = NewsletterCampaign::where('title', 'Nova Campanha')->firstOrFail();
        $this->assertSame('draft', $campaign->status);
        $this->assertTrue($campaign->posts->contains($post));
    }

    public function test_store_cria_campanha_agendada(): void
    {
        $user      = $this->adminUser(['newsletter_campaigns.create']);
        $post      = Post::factory()->create(['is_active' => true]);
        $scheduled = now()->addDay()->toIso8601String();

        $this->actingAs($user)
            ->post(route('admin.newsletter-campaigns.store'), [
                'title'        => 'Campanha Agendada',
                'subject'      => 'Assunto',
                'post_ids'     => [$post->id],
                'scheduled_at' => $scheduled,
            ])
            ->assertRedirect(route('admin.newsletter-campaigns.index'));

        $campaign = NewsletterCampaign::where('title', 'Campanha Agendada')->firstOrFail();
        $this->assertSame('scheduled', $campaign->status);
    }

    public function test_store_requer_pelo_menos_um_post(): void
    {
        $user = $this->adminUser(['newsletter_campaigns.create']);

        $this->actingAs($user)
            ->post(route('admin.newsletter-campaigns.store'), [
                'title'    => 'Sem posts',
                'subject'  => 'Assunto',
                'post_ids' => [],
            ])
            ->assertSessionHasErrors('post_ids');
    }

    // --- show ---

    public function test_show_exibe_campanha_com_stats(): void
    {
        $user     = $this->adminUser(['newsletter_campaigns.view']);
        $campaign = $this->campaign();
        $campaign->posts()->attach(Post::factory()->create());

        $this->actingAs($user)
            ->get(route('admin.newsletter-campaigns.show', $campaign))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/NewsletterCampaigns/Show')
                ->has('campaign')
                ->has('stats')
            );
    }

    // --- send ---

    public function test_send_enfileira_job_para_campanha_rascunho(): void
    {
        Queue::fake();
        $user     = $this->adminUser(['newsletter_campaigns.edit']);
        $campaign = $this->campaign(['status' => 'draft']);

        $this->actingAs($user)
            ->post(route('admin.newsletter-campaigns.send', $campaign))
            ->assertRedirect();

        Queue::assertPushed(SendNewsletterCampaign::class, fn ($job) =>
            $job->campaign->id === $campaign->id
        );
    }

    public function test_send_enfileira_job_para_campanha_agendada(): void
    {
        Queue::fake();
        $user     = $this->adminUser(['newsletter_campaigns.edit']);
        $campaign = $this->campaign(['status' => 'scheduled', 'scheduled_at' => now()->addHour()]);

        $this->actingAs($user)
            ->post(route('admin.newsletter-campaigns.send', $campaign))
            ->assertRedirect();

        Queue::assertPushed(SendNewsletterCampaign::class);
    }

    public function test_send_bloqueado_para_campanha_ja_enviada(): void
    {
        Queue::fake();
        $user     = $this->adminUser(['newsletter_campaigns.edit']);
        $campaign = $this->campaign(['status' => 'sent']);

        $this->actingAs($user)
            ->post(route('admin.newsletter-campaigns.send', $campaign))
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'error');

        Queue::assertNothingPushed();
    }

    // --- destroy ---

    public function test_destroy_remove_campanha(): void
    {
        $user     = $this->adminUser(['newsletter_campaigns.delete']);
        $campaign = $this->campaign();

        $this->actingAs($user)
            ->delete(route('admin.newsletter-campaigns.destroy', $campaign))
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseMissing('newsletter_campaigns', ['id' => $campaign->id]);
    }

    public function test_destroy_bloqueado_para_campanha_em_envio(): void
    {
        $user     = $this->adminUser(['newsletter_campaigns.delete']);
        $campaign = $this->campaign(['status' => 'sending']);

        $this->actingAs($user)
            ->delete(route('admin.newsletter-campaigns.destroy', $campaign))
            ->assertRedirect()
            ->assertSessionHas('toast.type', 'error');

        $this->assertDatabaseHas('newsletter_campaigns', ['id' => $campaign->id]);
    }
}
