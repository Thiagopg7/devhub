<?php

namespace App\Http\Controllers;

use App\Models\Technology;
use Inertia\Inertia;

class TechnologyController extends Controller
{
    public function index()
    {
        return Inertia::render('Technologies/Index', [
            'technologies' => Technology::active()->ordered()->get(),
        ]);
    }
}
