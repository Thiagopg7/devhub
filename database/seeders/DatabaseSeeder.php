<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PermissionsSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            PostSeeder::class,
            PageSeeder::class,
            TechnologySeeder::class,
            NewsletterAreaSeeder::class,
            ConfigSeeder::class,
            MenuSeeder::class,
            EventSeeder::class,
            TestimonialSeeder::class,
            StackItemSeeder::class,
        ]);
    }
}
