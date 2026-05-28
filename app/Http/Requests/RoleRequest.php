<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $role = $this->route('role');

        // store: sem alvo específico — middleware já verificou a permission.
        if (! $role) {
            return true;
        }

        // update: delega à RolePolicy::update.
        return $this->user()->can('update', $role);
    }

    public function rules(): array
    {
        $roleId = $this->route('role')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('roles', 'name')->ignore($roleId),
            ],
            'permissions' => ['array'],
            'permissions.*' => ['string'],
        ];
    }
}
