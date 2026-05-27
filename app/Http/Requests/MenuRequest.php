<?php

namespace App\Http\Requests;

use App\Models\MenuItem;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class MenuRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'label'           => ['required', 'string', 'max:100'],
            'url'             => ['required', 'string', 'max:500'],
            'parent_id'       => ['nullable', 'exists:menu_items,id'],
            'order'           => ['nullable', 'integer', 'min:0'],
            'is_active'       => ['boolean'],
            'open_in_new_tab' => ['boolean'],
        ];
    }

    /**
     * Valida as regras de hierarquia do menu (máximo de dois níveis).
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $parentId = $this->input('parent_id');

            if (!$parentId) {
                return;
            }

            $parent = MenuItem::find($parentId);

            if ($parent && $parent->parent_id !== null) {
                $validator->errors()->add('parent_id', 'Não é possível criar mais de dois níveis de menu.');
            }

            $menu = $this->route('menu');

            if ($menu instanceof MenuItem && $menu->children()->exists()) {
                $validator->errors()->add('parent_id', 'Este item possui submenus e não pode se tornar um submenu.');
            }
        });
    }
}
