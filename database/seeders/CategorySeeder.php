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
                'name'        => 'Desenvolvimento Web',
                'color'       => '#3B82F6',
                'description' => 'Artigos sobre front-end, back-end, APIs e tudo que envolve construir para a web.',
            ],
            [
                'name'        => 'DevOps',
                'color'       => '#F97316',
                'description' => 'Infraestrutura, CI/CD, containers, cloud e boas práticas de entrega contínua.',
            ],
            [
                'name'        => 'Banco de Dados',
                'color'       => '#8B5CF6',
                'description' => 'Modelagem, otimização de queries, migrations e comparativos entre SGBDs.',
            ],
            [
                'name'        => 'Carreira',
                'color'       => '#10B981',
                'description' => 'Dicas sobre mercado de trabalho, soft skills, portfólio e crescimento profissional.',
            ],
            [
                'name'        => 'Boas Práticas',
                'color'       => '#EAB308',
                'description' => 'Padrões de projeto, clean code, testes e princípios que tornam o código sustentável.',
            ],
            [
                'name'        => 'Ferramentas',
                'color'       => '#EC4899',
                'description' => 'IDEs, CLIs, extensões e utilitários que aumentam a produtividade no dia a dia.',
            ],
        ];

        foreach ($categories as $data) {
            Category::firstOrCreate(['name' => $data['name']], $data);
        }
    }
}
