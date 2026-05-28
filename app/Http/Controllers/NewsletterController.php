<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsletterSubscribeRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    public function store(NewsletterSubscribeRequest $request): JsonResponse
    {
        // Honeypot: bots fill this hidden field, real users never do
        if ($request->filled('website')) {
            return response()->json(['message' => 'Inscrição realizada com sucesso!']);
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

    public function unsubscribe(string $token): RedirectResponse
    {
        $subscriber = NewsletterSubscriber::where('unsubscribe_token', $token)->firstOrFail();
        $subscriber->delete();

        return redirect('/')->with('unsubscribed', true);
    }
}
