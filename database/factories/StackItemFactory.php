<?php

namespace Database\Factories;

use App\Models\StackItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class StackItemFactory extends Factory
{
    protected $model = StackItem::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'icon' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/></svg>',
            'order' => null,
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }
}
