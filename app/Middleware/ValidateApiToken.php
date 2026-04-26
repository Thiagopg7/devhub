<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $bearer = $request->bearerToken();

        if (!$bearer) {
            return response()->json(['message' => 'Token não informado.'], 401);
        }

        $token = ApiToken::where('token_hash', hash('sha256', $bearer))->first();

        if (!$token || $token->isExpired()) {
            return response()->json(['message' => 'Token inválido ou expirado.'], 401);
        }

        $token->update(['last_used_at' => now()]);

        return $next($request);
    }
}
