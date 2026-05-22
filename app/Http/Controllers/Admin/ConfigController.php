<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveConfigRequest;
use App\Models\Config;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
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
    ];

    public function edit(): Response
    {
        return Inertia::render('Admin/Configs/Form', [
            'values' => Config::pluck('value', 'key'),
        ]);
    }

    private const SENSITIVE_KEYS = ['scripts_head', 'scripts_body'];

    public function update(SaveConfigRequest $request): RedirectResponse
    {
        $configs = $request->validated()['config'] ?? [];

        foreach ($configs as $key => $value) {
            $newValue = $value ?: null;

            if (in_array($key, self::SENSITIVE_KEYS, true)) {
                $oldValue = Config::find($key)?->value;
                if ($oldValue !== $newValue) {
                    Log::warning('Config sensível alterada', [
                        'key'        => $key,
                        'user_id'    => $request->user()?->id,
                        'user_email' => $request->user()?->email,
                        'ip'         => $request->ip(),
                        'old_length' => is_string($oldValue) ? strlen($oldValue) : null,
                        'new_length' => is_string($newValue) ? strlen($newValue) : null,
                    ]);
                }
            }

            Config::setValue($key, $newValue, self::KEY_GROUPS[$key] ?? 'general');
        }

        return back()->with('toast', [
            'title'   => 'Sucesso!',
            'message' => 'Configurações salvas com sucesso.',
            'type'    => 'success',
        ]);
    }
}
