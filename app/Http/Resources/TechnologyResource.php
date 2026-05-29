<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TechnologyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'description'      => $this->description,
            'url'              => $this->url,
            'icon_image'       => $this->icon_image_url,
            'screenshot_image' => $this->screenshot_image_url,
            'order'            => $this->order,
        ];
    }
}
