<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $checks = [
            'database' => $this->check(fn () => DB::connection()->getPdo()),
            'cache' => $this->check(function () {
                $token = uniqid('health:', true);
                Cache::put('health:ping', $token, 10);

                return Cache::get('health:ping') === $token;
            }),
        ];

        $healthy = ! in_array('down', $checks, true);

        return response()->json([
            'status' => $healthy ? 'ok' : 'degraded',
            'checks' => $checks,
        ], $healthy ? 200 : 503);
    }

    private function check(callable $probe): string
    {
        try {
            return $probe() === false ? 'down' : 'up';
        } catch (Throwable) {
            return 'down';
        }
    }
}
