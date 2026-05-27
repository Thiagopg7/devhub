<?php

namespace App\Jobs;

use App\Mail\NewsletterCampaignMail;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSendLog;
use App\Models\NewsletterSubscriber;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendNewsletterCampaign implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public readonly NewsletterCampaign $campaign) {}

    public function handle(): void
    {
        $this->campaign->update(['status' => 'sending']);

        $this->campaign->load('posts');

        NewsletterSubscriber::whereNotNull('unsubscribe_token')
            ->where('lgpd_consent', true)
            ->chunkById(50, function ($subscribers) {
                foreach ($subscribers as $subscriber) {
                    $log = NewsletterSendLog::firstOrCreate(
                        [
                            'newsletter_campaign_id'    => $this->campaign->id,
                            'newsletter_subscriber_id'  => $subscriber->id,
                        ],
                        ['status' => 'pending']
                    );

                    // pula quem já recebeu (seguro para reprocessamento)
                    if ($log->status === 'sent') {
                        continue;
                    }

                    try {
                        Mail::to($subscriber->email, $subscriber->name)
                            ->send(new NewsletterCampaignMail($this->campaign, $subscriber));

                        $log->update(['status' => 'sent', 'sent_at' => now(), 'error' => null]);
                    } catch (Throwable $e) {
                        $log->update(['status' => 'failed', 'error' => substr($e->getMessage(), 0, 500)]);
                    }

                    // rate limit: 20 e-mails/segundo máximo
                    usleep(50_000);
                }
            });

        $hasFailed = $this->campaign->sendLogs()->where('status', 'failed')->exists();

        $this->campaign->update([
            'status'  => $hasFailed ? 'failed' : 'sent',
            'sent_at' => now(),
        ]);
    }

    public function failed(Throwable $e): void
    {
        $this->campaign->update(['status' => 'failed']);
    }
}
