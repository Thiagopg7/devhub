<?php

namespace App\Services;

use App\Models\Technology;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class TechnologyService
{
    public function getActive(int $limit = 8): Collection
    {
        return Technology::active()
            ->orderBy('order')
            ->orderBy('name')
            ->limit($limit)
            ->get();
    }

    public function getPaginated(int $perPage = 20): LengthAwarePaginator
    {
        return Technology::orderBy('order')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function create(array $data): Technology
    {
        return Technology::create($data);
    }

    public function update(Technology $technology, array $data): Technology
    {
        $technology->update($data);

        return $technology;
    }

    public function delete(Technology $technology): void
    {
        $technology->delete();
    }
}
