<?php

namespace App\Traits;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity as SpatieLogsActivity;

trait HasActivityLog
{
    use SpatieLogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        $attributes = property_exists($this, 'logAttributes') && !empty($this->logAttributes)
            ? $this->logAttributes
            : ['*'];

        $ignored = property_exists($this, 'logAttributesToIgnore') && !empty($this->logAttributesToIgnore)
            ? $this->logAttributesToIgnore
            : ['updated_at', 'created_at', 'deleted_at', 'remember_token', 'password'];

        return LogOptions::defaults()
            ->logOnly($attributes)
            ->logExcept($ignored)
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName(strtolower(class_basename($this)))
            ->setDescriptionForEvent(fn (string $eventName) => $eventName);
    }
}
