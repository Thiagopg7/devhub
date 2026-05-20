<?php

namespace App\Services;

use App\Models\NewsletterArea;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class NewsletterAreaService
{
    public function getActive(): Collection
    {
        return NewsletterArea::active()->orderBy('order')->orderBy('name')->get();
    }

    public function getPaginated(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        $query = NewsletterArea::orderBy('order')->orderBy('name');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function create(array $data): NewsletterArea
    {
        return NewsletterArea::create($data);
    }

    public function update(NewsletterArea $area, array $data): NewsletterArea
    {
        $area->update($data);

        return $area;
    }

    public function delete(NewsletterArea $area): void
    {
        $area->delete();
    }
}
