<?php

namespace App\Services;

use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class MenuService
{
    public function getAdminList(): Collection
    {
        return MenuItem::with(['children' => fn ($q) => $q->orderBy('order')])
            ->roots()
            ->orderBy('order')
            ->get();
    }

    public function getRoots(): Collection
    {
        return MenuItem::roots()->orderBy('order')->get();
    }

    public function getPublicTree(): array
    {
        return Cache::remember('menu.shared', 3600, function () {
            return MenuItem::with(['children' => fn ($q) => $q->active()->orderBy('order')])
                ->roots()
                ->active()
                ->orderBy('order')
                ->get()
                ->toArray();
        });
    }

    public function create(array $data): MenuItem
    {
        $item = MenuItem::create($data);
        $this->clearCache();

        return $item;
    }

    public function update(MenuItem $item, array $data): MenuItem
    {
        $item->update($data);
        $this->clearCache();

        return $item;
    }

    public function delete(MenuItem $item): void
    {
        $item->delete();
        $this->clearCache();
    }

    public function clearCache(): void
    {
        Cache::forget('menu.shared');
    }
}
