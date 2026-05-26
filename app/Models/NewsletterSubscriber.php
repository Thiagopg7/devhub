<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsletterSubscriber extends Model
{
    protected $fillable = [
        'name',
        'email',
        'newsletter_area_id',
        'ip_address',
        'lgpd_consent',
        'lgpd_consent_at',
        'unsubscribe_token',
    ];

    protected $casts = [
        'lgpd_consent'    => 'boolean',
        'lgpd_consent_at' => 'datetime',
    ];

    public function area(): BelongsTo
    {
        return $this->belongsTo(NewsletterArea::class, 'newsletter_area_id');
    }
}
