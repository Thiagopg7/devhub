<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use App\Support\ApiCache;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        $payload = ApiCache::remember(ApiCache::TESTIMONIALS, 'index', function () {
            return TestimonialResource::collection(
                Testimonial::active()->ordered()->get()
            )->response()->getData(true);
        });

        return response()->json($payload);
    }
}
