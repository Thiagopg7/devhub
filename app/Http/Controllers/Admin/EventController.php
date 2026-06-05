<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\EventRequest;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $search      = $request->input('q');
        $type        = $request->input('type');
        $eventStatus = $request->input('event_status');
        $period      = $request->input('period', 'upcoming');

        $events = Event::query()
            ->when($period === 'upcoming', fn ($q) => $q
                ->where('is_active', true)
                ->whereDate('date', '>=', now()->startOfDay()))
            ->when($period === 'past', fn ($q) => $q
                ->whereDate('date', '<', now()->startOfDay()))
            ->when($search, fn ($q) => $q->where(fn ($qq) => $qq
                ->where('title', 'like', "%{$search}%")
                ->orWhere('org', 'like', "%{$search}%")
            ))
            ->when($type, fn ($q) => $q->where('type', $type))
            ->when($eventStatus, fn ($q) => $q->where('status', $eventStatus))
            ->ordered()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
            'filter' => $request->only('q', 'type', 'event_status', 'period'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Events/Form');
    }

    public function store(EventRequest $request): RedirectResponse
    {
        Event::create($request->validated());

        return redirect()->route('admin.events.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Evento criado com sucesso.', 'type' => 'success']);
    }

    public function edit(Event $event): Response
    {
        return Inertia::render('Admin/Events/Form', ['event' => $event]);
    }

    public function update(EventRequest $request, Event $event): RedirectResponse
    {
        $event->update($request->validated());

        return redirect()->route('admin.events.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Evento atualizado com sucesso.', 'type' => 'success']);
    }

    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Evento excluído com sucesso.', 'type' => 'success']);
    }
}
