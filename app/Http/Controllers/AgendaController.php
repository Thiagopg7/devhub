<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class AgendaController extends Controller
{
    public function index(): Response
    {
        $today = now()->startOfDay();

        $upcoming = Event::active()->whereDate('date', '>=', $today)->orderBy('date')->get();
        $past     = Event::active()->whereDate('date', '<',  $today)->orderByDesc('date')->get();

        return Inertia::render('Agenda', ['events' => $upcoming->concat($past)]);
    }
}
