<?php

namespace Tests\Feature\Jobs;

use App\Jobs\SendNewsletterCampaign;
use App\Mail\NewsletterCampaignMail;
use App\Models\NewsletterArea;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSendLog;
use App\Models\NewsletterSubscriber;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class SendNewsletterCampaignTest extends TestCase
{
    use RefreshDatabase;

    private function campaign(): NewsletterCampaign
    {
        $campaign = NewsletterCampaign::create([
            'title' => 'Edição de Teste',
            'subject' => 'Novidades da semana',
            'status' => 'draft',
        ]);
        $campaign->posts()->attach(Post::factory()->create());

        return $campaign;
    }

    private function subscriber(array $attrs = []): NewsletterSubscriber
    {
        $area = NewsletterArea::create(['name' => 'Geral', 'is_active' => true]);

        return NewsletterSubscriber::create(array_merge([
            'name' => 'Fulano',
            'email' => 'fulano@exemplo.com',
            'newsletter_area_id' => $area->id,
            'lgpd_consent' => true,
            'lgpd_consent_at' => now(),
            'unsubscribe_token' => 'token-abc',
        ], $attrs));
    }

    public function test_envia_email_para_inscritos_com_consentimento(): void
    {
        Mail::fake();
        $campaign = $this->campaign();
        $subscriber = $this->subscriber();

        (new SendNewsletterCampaign($campaign))->handle();

        Mail::assertSent(NewsletterCampaignMail::class, fn ($mail) => $mail->hasTo($subscriber->email)
        );
    }

    public function test_nao_envia_para_inscrito_sem_consentimento_lgpd(): void
    {
        Mail::fake();
        $campaign = $this->campaign();
        $this->subscriber(['lgpd_consent' => false, 'email' => 'semconsent@exemplo.com']);

        (new SendNewsletterCampaign($campaign))->handle();

        Mail::assertNothingSent();
    }

    public function test_nao_envia_para_inscrito_sem_token_de_descadastro(): void
    {
        Mail::fake();
        $campaign = $this->campaign();
        $this->subscriber(['unsubscribe_token' => null, 'email' => 'semtoken@exemplo.com']);

        (new SendNewsletterCampaign($campaign))->handle();

        Mail::assertNothingSent();
    }

    public function test_marca_campanha_como_sent_apos_envio(): void
    {
        Mail::fake();
        $campaign = $this->campaign();
        $this->subscriber();

        (new SendNewsletterCampaign($campaign))->handle();

        $this->assertSame('sent', $campaign->fresh()->status);
        $this->assertNotNull($campaign->fresh()->sent_at);
    }

    public function test_marca_campanha_como_failed_se_algum_envio_falhar(): void
    {
        Mail::shouldReceive('to')->andThrow(new \RuntimeException('SMTP error'));

        $campaign = $this->campaign();
        $this->subscriber();

        (new SendNewsletterCampaign($campaign))->handle();

        $this->assertSame('failed', $campaign->fresh()->status);
    }

    public function test_registra_log_de_envio_por_inscrito(): void
    {
        Mail::fake();
        $campaign = $this->campaign();
        $subscriber = $this->subscriber();

        (new SendNewsletterCampaign($campaign))->handle();

        $this->assertDatabaseHas('newsletter_send_logs', [
            'newsletter_campaign_id' => $campaign->id,
            'newsletter_subscriber_id' => $subscriber->id,
            'status' => 'sent',
        ]);
    }

    public function test_nao_reprocessa_log_ja_enviado(): void
    {
        Mail::fake();
        $campaign = $this->campaign();
        $subscriber = $this->subscriber();

        NewsletterSendLog::create([
            'newsletter_campaign_id' => $campaign->id,
            'newsletter_subscriber_id' => $subscriber->id,
            'status' => 'sent',
            'sent_at' => now()->subMinute(),
        ]);

        (new SendNewsletterCampaign($campaign))->handle();

        Mail::assertNothingSent();
        $this->assertDatabaseCount('newsletter_send_logs', 1);
    }

    public function test_failed_marca_campanha_como_failed(): void
    {
        $campaign = $this->campaign();

        (new SendNewsletterCampaign($campaign))->failed(new \RuntimeException('Job falhou'));

        $this->assertSame('failed', $campaign->fresh()->status);
    }
}
