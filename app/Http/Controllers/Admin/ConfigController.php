<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveConfigRequest;
use App\Models\Config;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ConfigController extends Controller
{
    private const KEY_GROUPS = [
        'site_name'            => 'general',
        'site_tagline'         => 'general',
        'footer_facebook'      => 'footer',
        'footer_instagram'     => 'footer',
        'footer_youtube'       => 'footer',
        'footer_message'       => 'footer',
        'contact_email'        => 'contact',
        'contact_address'      => 'contact',
        'contact_address_link' => 'contact',
        'scripts_head'         => 'scripts',
        'scripts_body'         => 'scripts',
        'recaptcha_site_key'   => 'recaptcha',
        'recaptcha_secret_key' => 'recaptcha',
    ];

    public function edit(): Response
    {
        return Inertia::render('Admin/Configs/Form', [
            'values' => Config::pluck('value', 'key'),
        ]);
    }

    public function update(SaveConfigRequest $request): RedirectResponse
    {
        $configs = $request->validated()['config'] ?? [];

        foreach ($configs as $key => $value) {
            Config::setValue($key, $value ?: null, self::KEY_GROUPS[$key] ?? 'general');
        }

        Cache::forget('configs.shared');

        return back()->with('success', 'Configurações salvas com sucesso.');
    }
}
