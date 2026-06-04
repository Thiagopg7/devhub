<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(5),
            'type' => $this->faker->randomElement(['conf', 'meetup', 'workshop', 'hack']),
            'org' => $this->faker->company(),
            'date' => $this->faker->dateTimeBetween('now', '+6 months')->format('Y-m-d'),
            'time' => '19h00 – 21h00',
            'location' => $this->faker->city().', BR',
            'is_online' => false,
            'status' => 'open',
            'cta_label' => 'Garantir vaga',
            'cta_style' => 'primary',
            'cta_url' => $this->faker->url(),
            'seats' => 'Vagas disponíveis',
            'seats_low' => false,
            'is_active' => true,
            'order' => null,
        ];
    }

    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }

    public function online(): static
    {
        return $this->state(['is_online' => true, 'location' => 'Transmissão ao vivo']);
    }
}
