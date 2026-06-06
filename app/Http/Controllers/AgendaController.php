<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AgendaController extends Controller
{
    private const PER_PAGE = 6;

    private const STATUSES = ['open', 'soon', 'full'];

    public function index(Request $request): Response
    {
        $today = now()->startOfDay()->toDateString();

        $status = $request->input('status');
        $status = in_array($status, self::STATUSES, true) ? $status : null;

        $events = Event::active()
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByRaw('(date >= ?) desc', [$today])
            ->orderByRaw('case when date >= ? then `order` end asc', [$today])
            ->orderByRaw('case when date >= ? then date end asc', [$today])
            ->orderByRaw('case when date < ? then date end desc', [$today])
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('Agenda', [
            'events' => $events,
            'counts' => fn () => $this->counts(),
            'filters' => ['status' => $status],
        ]);
    }

    private function counts(): array
    {
        $byStatus = Event::active()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return [
            'all' => (int) $byStatus->sum(),
            'open' => (int) ($byStatus['open'] ?? 0),
            'soon' => (int) ($byStatus['soon'] ?? 0),
            'full' => (int) ($byStatus['full'] ?? 0),
        ];
    }
}
