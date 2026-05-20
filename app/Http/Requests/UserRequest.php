<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId   = $this->route('user')?->id;
        $isCreate = $this->isMethod('POST');

        return [
            'name'  => ['required', 'string', 'max:100'],
            'email' => [
                'required',
                'email:rfc',
                'max:254',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => [
                $isCreate ? 'required' : 'nullable',
                'string',
                'min:8',
                'max:100',
                'confirmed',
            ],
            'role_id'        => ['nullable', 'integer', 'exists:roles,id'],
            'is_super_admin' => ['boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower(trim((string) $this->input('email', ''))),
        ]);
    }
}
