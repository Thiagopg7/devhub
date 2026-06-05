<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveConfigRequest extends FormRequest
{
    protected const ALLOWED_KEYS = [
        'site_name',
        'site_tagline',
        'footer_github',
        'footer_linkedin',
        'footer_facebook',
        'footer_instagram',
        'footer_youtube',
        'footer_message',
        'contact_email',
        'contact_address',
        'contact_address_link',
        'scripts_head',
        'scripts_body',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [];

        foreach (self::ALLOWED_KEYS as $key) {
            $rules["config.{$key}"] = ['nullable', 'string', 'max:5000'];
        }

        $rules['config.contact_email'] = ['nullable', 'email', 'max:255'];
        $rules['config.footer_github'] = ['nullable', 'url', 'max:500'];
        $rules['config.footer_linkedin'] = ['nullable', 'url', 'max:500'];
        $rules['config.footer_facebook'] = ['nullable', 'url', 'max:500'];
        $rules['config.footer_instagram'] = ['nullable', 'url', 'max:500'];
        $rules['config.footer_youtube'] = ['nullable', 'url', 'max:500'];
        $rules['config.contact_address_link'] = ['nullable', 'url', 'max:500'];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'config.contact_email.email' => 'Informe um e-mail válido.',
            'config.footer_github.url'   => 'Informe uma URL válida para o GitHub.',
            'config.footer_linkedin.url' => 'Informe uma URL válida para o LinkedIn.',
            'config.footer_facebook.url' => 'Informe uma URL válida para o Facebook.',
            'config.footer_instagram.url' => 'Informe uma URL válida para o Instagram.',
            'config.footer_youtube.url' => 'Informe uma URL válida para o YouTube.',
            'config.contact_address_link.url' => 'Informe uma URL válida para o link do endereço.',
        ];
    }

    public function allowedKeys(): array
    {
        return self::ALLOWED_KEYS;
    }
}
