<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'eyebrow' => ['nullable', 'string', 'max:100'],
            'content' => ['nullable', 'string'],
            'main_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:5120'],
            'is_active' => ['boolean'],
            'is_searchable' => ['boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
