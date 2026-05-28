<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Spatie\Activitylog\Models\Activity;

class ActivityLogService
{
    public const EVENT_LABELS = [
        'created' => 'Criado',
        'updated' => 'Atualizado',
        'deleted' => 'Excluído',
        'restored' => 'Restaurado',
    ];

    public const PER_PAGE_OPTIONS = [10, 25, 50, 100];

    public const DEFAULT_PER_PAGE = 25;

    public function paginate(array $filters): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? self::DEFAULT_PER_PAGE;

        $query = Activity::query()
            ->with(['causer', 'subject'])
            ->orderByDesc('id');

        $this->applyFilters($query, $filters);

        return $query->paginate($perPage)
            ->withQueryString()
            ->through(fn (Activity $log) => $this->mapLog($log));
    }

    public function availableLogNames(): Collection
    {
        return Activity::query()
            ->whereNotNull('log_name')
            ->distinct()
            ->orderBy('log_name')
            ->pluck('log_name');
    }

    public function availableCausers(): Collection
    {
        return User::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    public function eventOptions(): array
    {
        return collect(self::EVENT_LABELS)
            ->map(fn ($label, $value) => ['value' => $value, 'label' => $label])
            ->values()
            ->all();
    }

    private function applyFilters($query, array $filters): void
    {
        $query
            ->when($filters['log_name'] ?? null, fn ($q, $v) => $q->where('log_name', $v))
            ->when($filters['event'] ?? null, fn ($q, $v) => $q->where('event', $v))
            ->when(
                $filters['causer_id'] ?? null,
                fn ($q, $v) => $q->where('causer_id', $v)->where('causer_type', User::class)
            )
            ->when($filters['date_from'] ?? null, fn ($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($filters['date_to'] ?? null, fn ($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->when($filters['search'] ?? null, function ($q, $v) {
                $term = '%'.$v.'%';
                $q->where(fn ($qq) => $qq
                    ->where('description', 'like', $term)
                    ->orWhere('log_name', 'like', $term)
                    ->orWhere('properties', 'like', $term)
                    ->orWhereHasMorph('causer', [User::class], fn ($cq) => $cq->where('name', 'like', $term))
                );
            });
    }

    private function mapLog(Activity $log): array
    {
        return [
            'id' => $log->id,
            'log_name' => $log->log_name,
            'event' => $log->event,
            'event_label' => self::EVENT_LABELS[$log->event] ?? $log->event,
            'description' => $log->description,
            'subject' => $this->describeSubject($log),
            'causer' => $log->causer ? [
                'id' => $log->causer->id,
                'name' => $log->causer->name,
            ] : null,
            'changes' => $log->properties->toArray(),
            'created_at' => $log->created_at?->toIso8601String(),
        ];
    }

    private function describeSubject(Activity $log): ?array
    {
        if (! $log->subject_type) {
            return null;
        }

        $title = null;
        if ($log->subject) {
            $title = $log->subject->title
                  ?? $log->subject->name
                  ?? $log->subject->slug
                  ?? null;
        }

        return [
            'type' => class_basename($log->subject_type),
            'id' => $log->subject_id,
            'title' => $title,
        ];
    }
}
