<?php

use App\Http\Controllers\PageController;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ResourcePermission;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('api')
                ->prefix('api')
                ->name('api.')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/admin.php'));

            Route::middleware('web')
                ->get('/{slug}', [PageController::class, 'show'])
                ->name('pages.show');
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => EnsureAdmin::class,
            'resource.permission' => ResourcePermission::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($e instanceof AuthenticationException
                || $e instanceof ValidationException) {
                return null;
            }

            if ($request->is('api/*')) {
                // Preserva o status de HttpExceptions (429 rate limit, 404, 403…)
                // para o cliente reagir corretamente; só mascara erros inesperados.
                if ($e instanceof HttpException) {
                    return response()->json([
                        'status' => 'error',
                        'message' => $e->getMessage() ?: 'Erro na requisição.',
                    ], $e->getStatusCode());
                }

                Log::error('Erro na API', [
                    'exception' => $e,
                    'url' => $request->fullUrl(),
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'Erro interno no servidor.',
                ], 500);
            }

            if ($e instanceof QueryException && ! $request->isMethod('GET')) {
                return back()->withInput()->with('toast', [
                    'title' => 'Erro!',
                    'message' => 'Erro ao acessar o banco de dados. Tente novamente.',
                    'type' => 'error',
                ]);
            }

            $status = $e instanceof HttpException ? $e->getStatusCode() : 500;

            if ($status === 403) {
                $toast = ['title' => 'Sem permissão', 'message' => 'Você não tem permissão para realizar esta ação.', 'type' => 'error'];

                return $request->isMethod('GET')
                    ? redirect()->route('admin.dashboard')->with('toast', $toast)
                    : back()->with('toast', $toast);
            }

            if (in_array($status, [404, 500, 503])) {
                if ($status === 500) {
                    Log::error('Erro HTTP 500', [
                        'exception' => $e,
                        'url' => $request->fullUrl(),
                        'method' => $request->method(),
                        'user_id' => $request->user()?->id,
                        'ip' => $request->ip(),
                    ]);
                }

                return Inertia::render('Error', ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }
        });
    })->create();
