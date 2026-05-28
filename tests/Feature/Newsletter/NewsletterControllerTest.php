<?php

namespace Tests\Feature\Newsletter;

use App\Models\NewsletterArea;
use App\Models\NewsletterSubscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsletterControllerTest extends TestCase
{
    use RefreshDatabase;

    private function area(): NewsletterArea
    {
        return NewsletterArea::create(['name' => 'Tecnologia', 'is_active' => true]);
    }

    // --- POST /newsletter/subscribe ---

    public function test_inscricao_valida_cria_inscrito_com_lgpd(): void
    {
        $area = $this->area();

        $this->postJson(route('newsletter.subscribe'), [
            'name' => 'Thiago',
            'email' => 'thiago@exemplo.com',
            'newsletter_area_id' => $area->id,
            'lgpd_consent' => true,
        ])->assertStatus(201)->assertJson(['message' => 'Inscrição realizada com sucesso!']);

        $subscriber = NewsletterSubscriber::where('email', 'thiago@exemplo.com')->firstOrFail();
        $this->assertTrue($subscriber->lgpd_consent);
        $this->assertNotNull($subscriber->lgpd_consent_at);
        $this->assertNotNull($subscriber->unsubscribe_token);
    }

    public function test_inscricao_sem_consentimento_lgpd_e_rejeitada(): void
    {
        $area = $this->area();

        $this->postJson(route('newsletter.subscribe'), [
            'name' => 'Thiago',
            'email' => 'thiago@exemplo.com',
            'newsletter_area_id' => $area->id,
            'lgpd_consent' => false,
        ])->assertUnprocessable()->assertJsonValidationErrors(['lgpd_consent']);
    }

    public function test_inscricao_com_email_duplicado_e_rejeitada(): void
    {
        $area = $this->area();
        NewsletterSubscriber::create([
            'name' => 'Outro',
            'email' => 'thiago@exemplo.com',
            'newsletter_area_id' => $area->id,
            'lgpd_consent' => true,
            'lgpd_consent_at' => now(),
            'unsubscribe_token' => 'token-existente',
        ]);

        $this->postJson(route('newsletter.subscribe'), [
            'name' => 'Thiago',
            'email' => 'thiago@exemplo.com',
            'newsletter_area_id' => $area->id,
            'lgpd_consent' => true,
        ])->assertUnprocessable()->assertJsonValidationErrors(['email']);
    }

    public function test_honeypot_preenchido_retorna_sucesso_sem_criar_inscrito(): void
    {
        $area = $this->area();

        $this->postJson(route('newsletter.subscribe'), [
            'name' => 'Bot',
            'email' => 'bot@spam.com',
            'newsletter_area_id' => $area->id,
            'lgpd_consent' => true,
            'website' => 'http://spam.com',
        ])->assertOk()->assertJson(['message' => 'Inscrição realizada com sucesso!']);

        $this->assertDatabaseMissing('newsletter_subscribers', ['email' => 'bot@spam.com']);
    }

    public function test_inscricao_requer_campos_obrigatorios(): void
    {
        $this->postJson(route('newsletter.subscribe'), [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'newsletter_area_id', 'lgpd_consent']);
    }

    // --- GET /newsletter/unsubscribe/{token} ---

    public function test_unsubscribe_com_token_valido_remove_inscrito(): void
    {
        $area = $this->area();
        $subscriber = NewsletterSubscriber::create([
            'name' => 'Thiago',
            'email' => 'thiago@exemplo.com',
            'newsletter_area_id' => $area->id,
            'lgpd_consent' => true,
            'lgpd_consent_at' => now(),
            'unsubscribe_token' => 'token-valido-abc123',
        ]);

        $this->get(route('newsletter.unsubscribe', 'token-valido-abc123'))
            ->assertRedirect('/');

        $this->assertDatabaseMissing('newsletter_subscribers', ['id' => $subscriber->id]);
    }

    public function test_unsubscribe_com_token_invalido_retorna_404(): void
    {
        $this->get(route('newsletter.unsubscribe', 'token-inexistente'))
            ->assertNotFound();
    }
}
