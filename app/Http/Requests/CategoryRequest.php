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
        if ($this->input('icon') === '') {
            $this->merge(['icon' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'icon' => ['nullable', 'string', Rule::in(self::ICON_KEYS)],
            'description' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ];
    }

    public const ICON_KEYS = [
        'Server', 'Monitor', 'Brain', 'Database', 'Briefcase', 'Wrench',
        'Code', 'Cloud', 'Cpu', 'Layers', 'Globe', 'Terminal', 'GitBranch',
        'Smartphone', 'ShieldCheck', 'Sparkles', 'Rocket', 'BookOpen',
        'TrendingUp', 'Palette',
    ];
}
