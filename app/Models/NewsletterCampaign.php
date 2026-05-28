<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NewsletterCampaign extends Model
{
    protected $fillable = [
        'title',
        'subject',
        'status',
        'scheduled_at',
        'sent_at',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'newsletter_campaign_post');
    }

    public function sendLogs(): HasMany
    {
        return $this->hasMany(NewsletterSendLog::class);
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isScheduled(): bool
    {
        return $this->status === 'scheduled';
    }

    public function isSent(): bool
    {
        return $this->status === 'sent';
    }
}
