<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NewsletterSubscribeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'email:rfc', 'max:254', 'unique:newsletter_subscribers,email'],
            'newsletter_area_id' => ['required', 'integer', 'exists:newsletter_areas,id'],
            'lgpd_consent' => ['required', 'accepted'],
            'website' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Este e-mail já está inscrito.',
            'lgpd_consent.required' => 'É necessário aceitar o consentimento para continuar.',
            'lgpd_consent.accepted' => 'É necessário aceitar o consentimento para continuar.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => strip_tags(trim((string) $this->input('name', ''))),
            'email' => strtolower(trim((string) $this->input('email', ''))),
        ]);
    }
}
