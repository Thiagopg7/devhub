<?php

namespace App\Services;

use App\Models\Testimonial;
use Illuminate\Http\UploadedFile;

class TestimonialService
{
    public function __construct(private readonly FileUploadService $uploadService) {}

    public function create(array $data, ?UploadedFile $avatar = null): Testimonial
    {
        if ($avatar?->isValid()) {
            $data['avatar_image'] = $this->uploadService->upload($avatar, 'testimonials');
        }

        return Testimonial::create($data);
    }

    public function update(Testimonial $testimonial, array $data, ?UploadedFile $avatar = null): Testimonial
    {
        $oldAvatar = $testimonial->avatar_image;

        if ($avatar?->isValid()) {
            $data['avatar_image'] = $this->uploadService->upload($avatar, 'testimonials');
        } else {
            unset($data['avatar_image']);
        }

        $testimonial->update($data);

        if (isset($data['avatar_image']) && $oldAvatar) {
            $this->uploadService->delete($oldAvatar);
        }

        return $testimonial;
    }

    public function delete(Testimonial $testimonial): void
    {
        $this->uploadService->delete($testimonial->avatar_image);
        $testimonial->delete();
    }
}
