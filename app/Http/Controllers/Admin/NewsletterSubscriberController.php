<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterArea;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterSubscriberController extends Controller
{
    public function index(Request $request): Response
    {
        $query = NewsletterSubscriber::with('area:id,name')
            ->orderByDesc('created_at');

        if ($q = $request->input('q')) {
            $query->where(function ($q2) use ($q) {
                $q2->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        if ($area = $request->input('area')) {
            $query->where('newsletter_area_id', $area);
        }

        return Inertia::render('Admin/NewsletterSubscribers/Index', [
            'subscribers' => $query->paginate(20)->withQueryString(),
            'filter' => $request->only('q', 'area'),
            'total' => NewsletterSubscriber::count(),
            'areas' => NewsletterArea::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function destroy(NewsletterSubscriber $newsletterSubscriber): RedirectResponse
    {
        $newsletterSubscriber->delete();

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Inscrito removido com sucesso.', 'type' => 'success']);
    }
}
