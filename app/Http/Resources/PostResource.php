<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'content' => $this->content,
            'banner_image' => $this->banner_image_url,
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'name' => $this->category->name,
                'slug' => $this->category->slug,
                'color' => $this->category->color,
            ] : null),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'published_at' => $this->created_at->toIso8601String(),
        ];
    }
}
