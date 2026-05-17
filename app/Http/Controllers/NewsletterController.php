<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Honeypot: bots fill this hidden field, real users never do
        if ($request->filled('website')) {
            return response()->json(['message' => 'Inscrição realizada com sucesso!']);
        }

        // Sanitize before validation
        $request->merge([
            'name'  => strip_tags(trim((string) $request->input('name', ''))),
            'email' => strtolower(trim((string) $request->input('email', ''))),
        ]);

        $validated = $request->validate([
            'name'               => ['required', 'string', 'min:2', 'max:100'],
            'email'              => ['required', 'email:rfc', 'max:254', 'unique:newsletter_subscribers,email'],
            'newsletter_area_id' => ['required', 'integer', 'exists:newsletter_areas,id'],
        ], [
            'email.unique' => 'Este e-mail já está inscrito.',
        ]);

        NewsletterSubscriber::create([
            'name'               => $validated['name'],
            'email'              => $validated['email'],
            'newsletter_area_id' => $validated['newsletter_area_id'],
            'ip_address'         => $request->ip(),
        ]);

        return response()->json(['message' => 'Inscrição realizada com sucesso!'], 201);
    }
}
