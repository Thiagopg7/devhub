<?php

namespace Tests\Feature\Newsletter;

use App\Models\NewsletterCampaign;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;

class NewsletterCampaignActivityTest extends TestCase
{
    use RefreshDatabase;

    public function test_criar_campanha_registra_atividade(): void
    {
        $campaign = NewsletterCampaign::create([
            'title' => 'Edição de teste',
            'subject' => 'Assunto de teste',
            'status' => 'draft',
        ]);

        $this->assertDatabaseHas('activity_log', [
            'event' => 'created',
            'subject_type' => NewsletterCampaign::class,
            'subject_id' => $campaign->id,
        ]);
    }

    public function test_atualizar_campanha_registra_atividade(): void
    {
        $campaign = NewsletterCampaign::create([
            'title' => 'Rascunho',
            'subject' => 'Assunto',
            'status' => 'draft',
        ]);

        $campaign->update(['status' => 'scheduled']);

        $this->assertSame(
            'updated',
            Activity::where('subject_type', NewsletterCampaign::class)
                ->where('subject_id', $campaign->id)
                ->latest('id')
                ->first()?->event
        );
    }
}
