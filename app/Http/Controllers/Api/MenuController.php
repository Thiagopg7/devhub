<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MenuController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $items = MenuItem::active()
            ->roots()
            ->with(['children' => fn ($q) => $q->active()->orderBy('order')])
            ->orderBy('order')
            ->get();

        return MenuItemResource::collection($items);
    }
}
