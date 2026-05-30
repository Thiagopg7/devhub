<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSubscriber;
use App\Models\Post;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'posts' => [
                'total' => Post::count(),
                'active' => Post::active()->count(),
            ],
            'users' => User::count(),
            'subscribers' => NewsletterSubscriber::where('lgpd_consent', true)->count(),
            'campaigns' => NewsletterCampaign::count(),
        ];

        $counts = Post::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as total')
        )
            ->where('created_at', '>=', now()->startOfMonth()->subMonths(5))
            ->groupBy('month')
            ->pluck('total', 'month');

        $postsPerMonth = collect(range(5, 0))
            ->map(function (int $i) use ($counts) {
                $month = now()->startOfMonth()->subMonths($i)->format('Y-m');

                return ['month' => $month, 'total' => (int) ($counts[$month] ?? 0)];
            })
            ->values();

        $recentActivity = Activity::with('causer')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'event' => $a->event,
                'description' => ActivityLogService::EVENT_LABELS[$a->event] ?? $a->description,
                'subject' => ActivityLogService::subjectLabel($a->subject_type),
                'causer' => $a->causer?->name ?? 'Sistema',
                'created_at' => $a->created_at->diffForHumans(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'postsPerMonth' => $postsPerMonth,
            'recentActivity' => $recentActivity,
        ]);
    }
}
