<?php

namespace App\Http\Requests\Admin;

use App\Services\ActivityLogService;
use Illuminate\Foundation\Http\FormRequest;

class ActivityLogFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'log_name'  => ['nullable', 'string', 'max:255'],
            'event'     => ['nullable', 'string', 'in:' . implode(',', array_keys(ActivityLogService::EVENT_LABELS))],
            'causer_id' => ['nullable', 'integer'],
            'date_from' => ['nullable', 'date'],
            'date_to'   => ['nullable', 'date', 'after_or_equal:date_from'],
            'search'    => ['nullable', 'string', 'max:255'],
            'per_page'  => ['nullable', 'integer', 'in:' . implode(',', ActivityLogService::PER_PAGE_OPTIONS)],
        ];
    }

    public function filters(): array
    {
        $filters = $this->validated();

        $perPage = (int) ($filters['per_page'] ?? ActivityLogService::DEFAULT_PER_PAGE);
        if (!in_array($perPage, ActivityLogService::PER_PAGE_OPTIONS, true)) {
            $perPage = ActivityLogService::DEFAULT_PER_PAGE;
        }
        $filters['per_page'] = $perPage;

        return $filters;
    }
}
