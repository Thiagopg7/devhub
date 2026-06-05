<?php

namespace App\Models;

use App\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasActivityLog, HasFactory;

    protected $fillable = [
        'title',
        'type',
        'org',
        'date',
        'time',
        'location',
        'is_online',
        'status',
        'cta_label',
        'cta_style',
        'cta_url',
        'seats',
        'seats_low',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_online' => 'boolean',
        'seats_low' => 'boolean',
        'order' => 'integer',
        'date' => 'date',
    ];

    protected $appends = ['day', 'month', 'year', 'type_label', 'is_past'];

    private const TYPE_LABELS = [
        'conf' => 'Conferência',
        'meetup' => 'Meetup',
        'workshop' => 'Workshop',
        'hack' => 'Hackathon',
    ];

    private const MONTHS_PT = [
        1 => 'Jan', 2 => 'Fev', 3 => 'Mar', 4 => 'Abr',
        5 => 'Mai', 6 => 'Jun', 7 => 'Jul', 8 => 'Ago',
        9 => 'Set', 10 => 'Out', 11 => 'Nov', 12 => 'Dez',
    ];

    public function getDayAttribute(): string
    {
        return $this->date->format('d');
    }

    public function getMonthAttribute(): string
    {
        return self::MONTHS_PT[$this->date->month] ?? $this->date->format('M');
    }

    public function getYearAttribute(): string
    {
        return $this->date->format('Y');
    }

    public function getTypeLabelAttribute(): string
    {
        return self::TYPE_LABELS[$this->type] ?? $this->type;
    }

    public function getIsPastAttribute(): bool
    {
        return $this->date->lt(today());
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('date');
    }

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (is_null($model->order)) {
                $model->order = (static::max('order') ?? 0) + 1;
            }
        });
    }
}
