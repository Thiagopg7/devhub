<?php

namespace App\Console\Commands;

use App\Jobs\SendNewsletterCampaign;
use App\Models\NewsletterCampaign;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('newsletter:dispatch-scheduled')]
#[Description('Despacha campanhas de newsletter agendadas para a fila de envio')]
class DispatchScheduledNewsletters extends Command
{
    public function handle(): int
    {
        $campaigns = NewsletterCampaign::where('status', 'scheduled')
            ->where('scheduled_at', '<=', now())
            ->get();

        if ($campaigns->isEmpty()) {
            $this->line('Nenhuma campanha agendada para disparar.');

            return self::SUCCESS;
        }

        foreach ($campaigns as $campaign) {
            SendNewsletterCampaign::dispatch($campaign);
            $this->info("Campanha #{$campaign->id} \"{$campaign->title}\" enfileirada.");
        }

        return self::SUCCESS;
    }
}
