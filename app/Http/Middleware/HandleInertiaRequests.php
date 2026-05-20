<?php

namespace App\Http\Middleware;

use App\Models\Config;
use App\Services\MenuService;
use App\Services\NewsletterAreaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config as ConfigFacade;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $isAdmin = $request->routeIs('admin.*');
        $user    = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user'         => $user,
                'isSuperAdmin' => (bool) $user?->isSuperAdmin(),
                'permissions'  => $user
                    ? $user->getAllPermissions()->pluck('name')->values()->all()
                    : [],
            ],
            'siteConfig'      => Cache::remember('configs.shared', 3600, fn () => Config::pluck('value', 'key')),
            'menuItems'       => $isAdmin ? [] : app(MenuService::class)->getPublicTree(),
            'newsletterAreas' => $isAdmin ? [] : Cache::remember('newsletter_areas.active', 3600, function () {
                return app(NewsletterAreaService::class)->getActive()->values()->toArray();
            }),
            'permissionsCatalog' => $isAdmin ? [
                'modules' => ConfigFacade::get('permissions.modules', []),
                'actions' => ConfigFacade::get('permissions.actions', []),
            ] : null,
            'toast' => session('toast'),
        ];
    }
}
