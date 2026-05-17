<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'label'           => ['required', 'string', 'max:100'],
            'url'             => ['required', 'string', 'max:500'],
            'parent_id'       => ['nullable', 'exists:menu_items,id'],
            'order'           => ['integer', 'min:0'],
            'is_active'       => ['boolean'],
            'open_in_new_tab' => ['boolean'],
        ];
    }
}
