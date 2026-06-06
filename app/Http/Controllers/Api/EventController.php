<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Support\ApiCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $when = $request->string('when')->toString() ?: 'all'; // upcoming | past | all
        $type = $request->string('type')->toString();          // conf | meetup | workshop | hack

        $payload = ApiCache::remember(ApiCache::EVENTS, "index.{$when}.type.{$type}", function () use ($when, $type) {
            $query = Event::active()->orderBy('date');

            if ($when === 'upcoming') {
                $query->whereDate('date', '>=', today());
            } elseif ($when === 'past') {
                $query->whereDate('date', '<', today());
            }

            if ($type !== '') {
                $query->where('type', $type);
            }

            return EventResource::collection($query->get())->response()->getData(true);
        });

        return response()->json($payload);
    }
}
