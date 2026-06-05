<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\Config;
use App\Models\NewsletterArea;
use App\Services\MenuService;
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
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'isSuperAdmin' => (bool) $user?->isSuperAdmin(),
                'permissions' => $user
                    ? $user->getAllPermissions()->pluck('name')->values()->all()
                    : [],
            ],
            'siteConfig' => Cache::remember('configs.all', 3600, fn () => Config::pluck('value', 'key')->toArray()),
            'menuItems' => $isAdmin ? [] : app(MenuService::class)->getPublicTree(),
            'footerCategories' => $isAdmin ? [] : Cache::remember('categories.active.footer', 3600, fn () =>
                Category::active()->orderBy('name')->get(['name', 'slug'])->toArray()
            ),
            'newsletterAreas' => $isAdmin ? [] : Cache::remember('newsletter_areas.active', 3600, function () {
                return NewsletterArea::active()->ordered()->get()->toArray();
            }),
            'permissionsCatalog' => $isAdmin ? [
                'modules' => ConfigFacade::get('permissions.modules', []),
                'actions' => ConfigFacade::get('permissions.actions', []),
            ] : null,
            'toast' => session('toast'),
        ];
    }
}
