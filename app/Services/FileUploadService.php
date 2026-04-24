<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    public function upload(?UploadedFile $file, string $path = 'uploads', string $disk = 'public'): ?string
    {
        if (!$file || !$file->isValid()) {
            return null;
        }

        return $file->store($path, $disk);
    }

    public function delete(?string $filePath, string $disk = 'public'): void
    {
        if ($filePath && Storage::disk($disk)->exists($filePath)) {
            Storage::disk($disk)->delete($filePath);
        }
    }
}
