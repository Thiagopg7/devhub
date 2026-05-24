<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'title'            => $this->title,
            'slug'             => $this->slug,
            'subtitle'         => $this->subtitle,
            'content'          => $this->content,
            'banner_image'     => $this->banner_image_url,
            'main_image'       => $this->main_image_url,
            'gallery'          => $this->whenLoaded('galleryImages', fn () =>
                $this->galleryImages->map(fn ($img) => $img->image_url)->values()
            ),
            'meta_title'       => $this->meta_title,
            'meta_description' => $this->meta_description,
        ];
    }
}
