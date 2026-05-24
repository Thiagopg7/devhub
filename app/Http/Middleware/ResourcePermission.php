<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Aplica permission do tipo "{module}.{action}" inferida do nome da rota.
 *
 * Uso: Route::resource('posts', PostController::class)->middleware('resource.permission:posts');
 *
 * Mapeamento HTTP method/route action → permission:
 *   index, show        → view
 *   create, store      → create
 *   edit (GET form)    → view   (salvar via update ainda exige edit)
 *   update             → edit
 *   destroy            → delete
 */
class ResourcePermission
{
    private const ACTION_MAP = [
        'index'   => 'view',
        'show'    => 'view',
        'create'  => 'create',
        'store'   => 'create',
        'edit'    => 'view',
        'update'  => 'edit',
        'destroy' => 'delete',
    ];

    public function handle(Request $request, Closure $next, string $module): Response
    {
        $routeName = $request->route()?->getName() ?? '';
        $segments  = explode('.', $routeName);
        $action    = end($segments) ?: 'index';
        $perm      = self::ACTION_MAP[$action] ?? 'view';

        $user = $request->user();
        abort_unless($user?->can("{$module}.{$perm}"), 403);

        return $next($request);
    }
}
