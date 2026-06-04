<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class AgendaController extends Controller
{
    public function index(): Response
    {
        $events = Event::active()->ordered()->get();

        return Inertia::render('Agenda', ['events' => $events]);
    }
}
