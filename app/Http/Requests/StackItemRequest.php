<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StackItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'icon' => ['required', 'string', 'max:5000'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
