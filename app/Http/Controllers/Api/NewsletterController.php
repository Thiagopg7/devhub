<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsletterSubscribeRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    /**
     * Inscreve um e-mail na newsletter.
     *
     * Defesas: validação anti-injeção (strip_tags no nome, e-mail RFC),
     * honeypot, e-mail único e rate limit agressivo por IP na rota.
     */
    public function store(NewsletterSubscribeRequest $request): JsonResponse
    {
        // Honeypot: bots preenchem este campo oculto; usuários reais nunca.
        if ($request->filled('website')) {
            return response()->json(['message' => 'Inscrição realizada com sucesso!'], 201);
        }

        $validated = $request->validated();

        NewsletterSubscriber::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'newsletter_area_id' => $validated['newsletter_area_id'],
            'ip_address' => $request->ip(),
            'lgpd_consent' => true,
            'lgpd_consent_at' => now(),
            'unsubscribe_token' => Str::random(48),
        ]);

        return response()->json(['message' => 'Inscrição realizada com sucesso!'], 201);
    }
}
