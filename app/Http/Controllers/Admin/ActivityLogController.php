<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ActivityLogFilterRequest;
use App\Services\ActivityLogService;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function __construct(private readonly ActivityLogService $service) {}

    public function index(ActivityLogFilterRequest $request)
    {
        $filters = $request->filters();

        return Inertia::render('Admin/ActivityLog/Index', [
            'items' => $this->service->paginate($filters),
            'filters' => $filters,
            'logNames' => $this->service->availableLogNames(),
            'causers' => $this->service->availableCausers(),
            'events' => $this->service->eventOptions(),
            'perPageOptions' => ActivityLogService::PER_PAGE_OPTIONS,
        ]);
    }
}
