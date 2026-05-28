<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Desenvolvimento Web',
                'color' => '#3B82F6',
                'description' => 'Artigos sobre front-end, back-end, APIs e tudo que envolve construir para a web.',
                'slug' => 'desenvolvimento-web',
            ],
            [
                'name' => 'DevOps',
                'color' => '#F97316',
                'description' => 'Infraestrutura, CI/CD, containers, cloud e boas práticas de entrega contínua.',
                'slug' => 'devops',
            ],
            [
                'name' => 'Banco de Dados',
                'color' => '#8B5CF6',
                'description' => 'Modelagem, otimização de queries, migrations e comparativos entre SGBDs.',
                'slug' => 'banco-de-dados',
            ],
            [
                'name' => 'Carreira',
                'color' => '#10B981',
                'description' => 'Dicas sobre mercado de trabalho, soft skills, portfólio e crescimento profissional.',
                'slug' => 'carreira',
            ],
            [
                'name' => 'Boas Práticas',
                'color' => '#EAB308',
                'description' => 'Padrões de projeto, clean code, testes e princípios que tornam o código sustentável.',
                'slug' => 'boas-praticas',
            ],
            [
                'name' => 'Ferramentas',
                'color' => '#EC4899',
                'description' => 'IDEs, CLIs, extensões e utilitários que aumentam a produtividade no dia a dia.',
                'slug' => 'ferramentas',
            ],
        ];

        foreach ($categories as $data) {
            Category::firstOrCreate(['name' => $data['name']], $data);
        }
    }
}
