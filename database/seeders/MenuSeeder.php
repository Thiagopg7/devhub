<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $home = $this->firstOrCreateItem(['url' => '/'], [
            'label' => 'Home',
            'order' => 1,
            'is_active' => true,
        ]);

        $this->firstOrCreateItem(['url' => '/blog'], [
            'label' => 'Blog',
            'order' => 2,
            'is_active' => true,
        ]);

        $this->firstOrCreateItem(['url' => '/sobre-nos'], [
            'label' => 'Sobre Nós',
            'order' => 3,
            'is_active' => true,
        ]);

        $this->firstOrCreateItem(['url' => '/politica-de-privacidade'], [
            'label' => 'Privacidade',
            'order' => 4,
            'is_active' => true,
        ]);
    }

    private function firstOrCreateItem(array $search, array $values): MenuItem
    {
        return MenuItem::firstOrCreate($search, $values);
    }
}
