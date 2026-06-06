<?php

namespace Tests\Feature\Api;

use App\Models\NewsletterArea;
use App\Models\NewsletterSubscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsletterApiTest extends TestCase
{
    use RefreshDatabase;

    private NewsletterArea $area;

    protected function setUp(): void
    {
        parent::setUp();
        $this->area = NewsletterArea::create(['name' => 'Tecnologia', 'order' => 1, 'is_active' => true]);
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Maria Silva',
            'email' => 'maria@example.com',
            'newsletter_area_id' => $this->area->id,
            'lgpd_consent' => true,
        ], $overrides);
    }

    public function test_endpoint_e_publico_e_inscreve(): void
    {
        $this->postJson('/api/newsletter', $this->payload())
            ->assertStatus(201)
            ->assertJsonPath('message', 'Inscrição realizada com sucesso!');

        $this->assertDatabaseHas('newsletter_subscribers', ['email' => 'maria@example.com']);
    }

    public function test_exige_consentimento_lgpd_e_email_valido(): void
    {
        $this->postJson('/api/newsletter', $this->payload(['lgpd_consent' => false]))
            ->assertStatus(422)->assertJsonValidationErrors('lgpd_consent');

        $this->postJson('/api/newsletter', $this->payload(['email' => 'nao-eh-email']))
            ->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_email_duplicado_e_rejeitado(): void
    {
        $this->postJson('/api/newsletter', $this->payload())->assertStatus(201);

        $this->postJson('/api/newsletter', $this->payload())
            ->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_honeypot_descarta_silenciosamente(): void
    {
        $this->postJson('/api/newsletter', $this->payload(['website' => 'http://spam.bot']))
            ->assertStatus(201);

        $this->assertDatabaseCount('newsletter_subscribers', 0);
    }

    public function test_sanitiza_injecao_de_script_no_nome(): void
    {
        $this->postJson('/api/newsletter', $this->payload([
            'name' => '<script>alert(1)</script>Joao',
            'email' => 'joao@example.com',
        ]))->assertStatus(201);

        $subscriber = NewsletterSubscriber::where('email', 'joao@example.com')->first();
        $this->assertStringNotContainsString('<', $subscriber->name);
        $this->assertStringNotContainsString('<script', $subscriber->name);
    }

    public function test_rate_limit_bloqueia_flood(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            $this->postJson('/api/newsletter', $this->payload(['email' => "user{$i}@example.com"]))
                ->assertStatus(201);
        }

        // 6ª inscrição no mesmo minuto/IP é bloqueada (throttle:5,1).
        $this->postJson('/api/newsletter', $this->payload(['email' => 'user6@example.com']))
            ->assertStatus(429);
    }
}
