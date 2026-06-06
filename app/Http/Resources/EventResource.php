<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'type_label' => $this->type_label,
            'org' => $this->org,
            'date' => $this->date?->toDateString(),
            'day' => $this->day,
            'month' => $this->month,
            'year' => $this->year,
            'time' => $this->time,
            'location' => $this->location,
            'is_online' => (bool) $this->is_online,
            'status' => $this->status,
            'is_past' => (bool) $this->is_past,
            'cta_label' => $this->cta_label,
            'cta_style' => $this->cta_style,
            'cta_url' => $this->cta_url,
            'seats' => $this->seats,
            'seats_low' => (bool) $this->seats_low,
        ];
    }
}
