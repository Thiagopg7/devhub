<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'type' => ['required', 'in:conf,meetup,workshop,hack'],
            'org' => ['required', 'string', 'max:150'],
            'date' => ['required', 'date'],
            'time' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:200'],
            'is_online' => ['boolean'],
            'status' => ['required', 'in:open,soon,full'],
            'cta_label' => ['nullable', 'string', 'max:100'],
            'cta_style' => ['required', 'in:primary,ghost'],
            'cta_url' => ['nullable', 'url', 'max:500'],
            'seats' => ['nullable', 'string', 'max:150'],
            'seats_low' => ['boolean'],
            'is_active' => ['boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
