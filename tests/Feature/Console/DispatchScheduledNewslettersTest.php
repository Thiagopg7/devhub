<?php

namespace Tests\Feature\Console;

use App\Jobs\SendNewsletterCampaign;
use App\Models\NewsletterCampaign;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class DispatchScheduledNewslettersTest extends TestCase
{
    use RefreshDatabase;

    private function campaign(array $attrs = []): NewsletterCampaign
    {
        return NewsletterCampaign::create(array_merge([
            'title' => 'Campanha',
            'subject' => 'Assunto',
            'status' => 'draft',
        ], $attrs));
    }

    public function test_campanha_agendada_no_passado_e_despachada(): void
    {
        Queue::fake();

        $campaign = $this->campaign([
            'status' => 'scheduled',
            'scheduled_at' => now()->subHour(),
        ]);

        $this->artisan('newsletter:dispatch-scheduled')->assertSuccessful();

        Queue::assertPushed(SendNewsletterCampaign::class, fn ($job) => $job->campaign->id === $campaign->id);
    }

    public function test_campanha_draft_nao_e_despachada(): void
    {
        Queue::fake();

        $this->campaign(['status' => 'draft']);

        $this->artisan('newsletter:dispatch-scheduled')->assertSuccessful();

        Queue::assertNotPushed(SendNewsletterCampaign::class);
    }

    public function test_campanha_sent_nao_e_redespachada(): void
    {
        Queue::fake();

        $this->campaign([
            'status' => 'sent',
            'scheduled_at' => now()->subDay(),
        ]);

        $this->artisan('newsletter:dispatch-scheduled')->assertSuccessful();

        Queue::assertNotPushed(SendNewsletterCampaign::class);
    }

    public function test_campanha_agendada_para_o_futuro_nao_e_despachada(): void
    {
        Queue::fake();

        $this->campaign([
            'status' => 'scheduled',
            'scheduled_at' => now()->addHour(),
        ]);

        $this->artisan('newsletter:dispatch-scheduled')->assertSuccessful();

        Queue::assertNotPushed(SendNewsletterCampaign::class);
    }

    public function test_multiplas_campanhas_devidas_sao_despachadas(): void
    {
        Queue::fake();

        $c1 = $this->campaign(['status' => 'scheduled', 'scheduled_at' => now()->subHours(2)]);
        $c2 = $this->campaign(['status' => 'scheduled', 'scheduled_at' => now()->subMinutes(30)]);
        $this->campaign(['status' => 'draft']);

        $this->artisan('newsletter:dispatch-scheduled')->assertSuccessful();

        Queue::assertPushed(SendNewsletterCampaign::class, 2);
    }
}
