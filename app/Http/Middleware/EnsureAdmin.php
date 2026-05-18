<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    /**
     * Permite a entrada do painel admin para:
     *  - super admins (Gate::before já libera tudo)
     *  - usuários com qualquer role atribuída (têm ao menos uma permission do painel)
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        abort_unless($user && ($user->isSuperAdmin() || $user->roles()->exists()), 403);

        return $next($request);
    }
}
