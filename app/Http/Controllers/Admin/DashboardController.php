<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSubscriber;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index(): \Inertia\Response
    {
        $stats = [
            'posts' => [
                'total'  => Post::count(),
                'active' => Post::active()->count(),
            ],
            'users'       => User::count(),
            'subscribers' => NewsletterSubscriber::where('lgpd_consent', true)->count(),
            'campaigns'   => NewsletterCampaign::count(),
        ];

        $postsPerMonth = Post::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as total')
            )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $recentActivity = Activity::with('causer')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn ($a) => [
                'id'          => $a->id,
                'description' => $a->description,
                'subject'     => class_basename($a->subject_type ?? ''),
                'causer'      => $a->causer?->name ?? 'Sistema',
                'created_at'  => $a->created_at->diffForHumans(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats'          => $stats,
            'postsPerMonth'  => $postsPerMonth,
            'recentActivity' => $recentActivity,
        ]);
    }
}
