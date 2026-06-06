<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Picker vazio chega como "" (FormData não carrega null) — normaliza para null
        if ($this->input('icon') === '') {
            $this->merge(['icon' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            // Mantém em sincronia com CATEGORY_ICON_KEYS em resources/js/lib/categoryIcons.js
            'icon' => ['nullable', 'string', Rule::in(self::ICON_KEYS)],
            'description' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ];
    }

    /** Conjunto curado de ícones lucide permitidos para categorias. */
    public const ICON_KEYS = [
        'Server', 'Monitor', 'Brain', 'Database', 'Briefcase', 'Wrench',
        'Code', 'Cloud', 'Cpu', 'Layers', 'Globe', 'Terminal', 'GitBranch',
        'Smartphone', 'ShieldCheck', 'Sparkles', 'Rocket', 'BookOpen',
        'TrendingUp', 'Palette',
    ];
}
