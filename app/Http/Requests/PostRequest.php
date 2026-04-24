<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title'             => 'required|string|max:150',
            'description'       => 'required|string|max:255',
            'content'           => 'nullable|string',
            'banner_image'      => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:8192',
            'is_active'         => 'boolean',
            'meta_title'        => 'nullable|string|max:150',
            'meta_description'  => 'nullable|string|max:255',
        ];
    }
}
