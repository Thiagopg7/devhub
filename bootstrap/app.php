<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('api')
                ->prefix('api')
                ->name('api.')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/admin.php'));

            Route::middleware('web')
                ->get('/{slug}', [\App\Http\Controllers\PageController::class, 'show'])
                ->name('pages.show');
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin'               => \App\Http\Middleware\EnsureAdmin::class,
            'resource.permission' => \App\Http\Middleware\ResourcePermission::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($e instanceof \Illuminate\Auth\AuthenticationException
                || $e instanceof \Illuminate\Validation\ValidationException) {
                return null;
            }

            if ($request->is('api/*')) {
                Log::error('Erro na API', [
                    'error' => $e->getMessage(),
                    'url'   => $request->fullUrl(),
                ]);

                return response()->json([
                    'status'  => 'error',
                    'message' => 'Erro interno no servidor.',
                ], 500);
            }

            $status = $e instanceof HttpException ? $e->getStatusCode() : 500;

            if (in_array($status, [403, 404, 500, 503])) {
                return Inertia::render('Error', ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }
        });
    })->create();
