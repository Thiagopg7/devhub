<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TechnologyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:100'],
            'description'    => ['nullable', 'string', 'max:1000'],
            'url'            => ['required', 'url', 'max:500'],
            'icon_url'       => ['nullable', 'url', 'max:500'],
            'screenshot_url' => ['nullable', 'url', 'max:500'],
            'order'          => ['integer', 'min:0'],
            'is_active'      => ['boolean'],
        ];
    }
}
