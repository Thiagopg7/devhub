<?php

namespace App\Http\Middleware;

use App\Models\Config;
use App\Services\MenuService;
use App\Services\NewsletterAreaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'siteConfig'       => Cache::remember('configs.shared', 3600, function () {
                return Config::pluck('value', 'key');
            }),
            'menuItems'        => app(MenuService::class)->getPublicTree(),
            'newsletterAreas'  => Cache::remember('newsletter_areas.active', 3600, function () {
                return app(NewsletterAreaService::class)->getActive()->values()->toArray();
            }),
        ];
    }
}
