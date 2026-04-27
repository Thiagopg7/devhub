<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'title'            => $title,
            'description'      => fake()->sentence(),
            // 'slug'             => str($title)->slug(),
            'banner_image'     => null,
            'content'          => fake()->paragraphs(3, true),
            'meta_title'       => null,
            'meta_description' => null,
            'is_active'        => true,
        ];
    }
}
