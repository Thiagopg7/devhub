<?php

namespace Database\Seeders;

use App\Models\NewsletterArea;
use Illuminate\Database\Seeder;

class NewsletterAreaSeeder extends Seeder
{
    public function run(): void
    {
        $areas = [
            'Tecnologia',
            'Inovação',
            'Negócios',
            'Design',
            'Marketing',
            'Saúde',
            'Educação',
            'Outro',
        ];

        foreach ($areas as $index => $name) {
            NewsletterArea::create([
                'name'      => $name,
                'order'     => $index + 1,
                'is_active' => true,
            ]);
        }
    }
}
