<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'label'          => $this->label,
            'url'            => $this->url,
            'open_in_new_tab' => $this->open_in_new_tab,
            'children'       => $this->whenLoaded('children',
                fn () => MenuItemResource::collection($this->children)
            ),
        ];
    }
}
