<?php

namespace Tests\Feature;

use App\Models\Testimonial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TestimonialPublicTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_passa_testimonials_ativos(): void
    {
        Testimonial::factory()->create(['name' => 'Visível', 'is_active' => true]);
        Testimonial::factory()->create(['name' => 'Oculto', 'is_active' => false]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Home')
                ->has('testimonials', 1)
                ->where('testimonials.0.name', 'Visível')
            );
    }

    public function test_home_retorna_campo_avatar_image_url(): void
    {
        Testimonial::factory()->create(['is_active' => true, 'avatar_image' => null]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Home')
                ->has('testimonials.0.avatar_image_url')
            );
    }

    public function test_home_ordena_testimonials_por_order_e_nome(): void
    {
        Testimonial::factory()->create(['name' => 'Beta', 'order' => 2, 'is_active' => true]);
        Testimonial::factory()->create(['name' => 'Alpha', 'order' => 1, 'is_active' => true]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Home')
                ->where('testimonials.0.name', 'Alpha')
                ->where('testimonials.1.name', 'Beta')
            );
    }
}
