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
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'url' => ['required', 'url', 'max:500'],
            'icon_image' => ['nullable', 'mimes:jpg,jpeg,png,gif,webp', 'max:2048'],
            'screenshot_image' => ['nullable', 'mimes:jpg,jpeg,png,gif,webp', 'max:4096'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
