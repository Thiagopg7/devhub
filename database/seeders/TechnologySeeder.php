<?php

namespace Database\Seeders;

use App\Models\Technology;
use Illuminate\Database\Seeder;

class TechnologySeeder extends Seeder
{
    public function run(): void
    {
        $technologies = [
            [
                'name'             => 'Claude AI',
                'description'      => 'Assistente de IA da Anthropic com foco em segurança e confiabilidade. Excelente para escrita, análise, programação e raciocínio complexo.',
                'url'              => 'https://claude.ai',
                'icon_image'       => 'technologies/icon-claude-ai.png',
                'screenshot_image' => 'technologies/screenshot-claude-ai.jpg',
                'order'            => 1,
                'is_active'        => true,
            ],
            [
                'name'             => 'ChatGPT',
                'description'      => 'Modelo de IA da OpenAI que processa texto e gera respostas ou conteúdo com base no que você pede. Ideal para automatizar tarefas e gerar ideias.',
                'url'              => 'https://chatgpt.com',
                'icon_image'       => 'technologies/icon-chatgpt.png',
                'screenshot_image' => 'technologies/screenshot-chatgpt.png',
                'order'            => 2,
                'is_active'        => true,
            ],
            [
                'name'             => 'Figma',
                'description'      => 'Plataforma de design colaborativo para criar interfaces, protótipos e sistemas de design. A ferramenta padrão do mercado para UX/UI.',
                'url'              => 'https://figma.com',
                'icon_image'       => 'technologies/icon-figma.png',
                'screenshot_image' => 'technologies/screenshot-figma.png',
                'order'            => 3,
                'is_active'        => true,
            ],
            [
                'name'             => 'GitHub Copilot',
                'description'      => 'Assistente de código com IA integrado ao seu editor. Sugere linhas, funções e testes em tempo real enquanto você programa.',
                'url'              => 'https://github.com/features/copilot',
                'icon_image'       => 'technologies/icon-github-copilot.png',
                'screenshot_image' => 'technologies/screenshot-github-copilot.png',
                'order'            => 4,
                'is_active'        => true,
            ],
            [
                'name'             => 'Notion',
                'description'      => 'Espaço de trabalho all-in-one para notas, documentação, wikis e gerenciamento de projetos. Centraliza o conhecimento da equipe.',
                'url'              => 'https://notion.so',
                'icon_image'       => 'technologies/icon-notion.png',
                'screenshot_image' => 'technologies/screenshot-notion.png',
                'order'            => 5,
                'is_active'        => true,
            ],
            [
                'name'             => 'Vercel',
                'description'      => 'Plataforma de deploy e hospedagem focada em frontend. Zero configuração, previews automáticos por branch e edge network global.',
                'url'              => 'https://vercel.com',
                'icon_image'       => 'technologies/icon-vercel.png',
                'screenshot_image' => 'technologies/screenshot-vercel.png',
                'order'            => 6,
                'is_active'        => true,
            ],
            [
                'name'             => 'Tailwind CSS',
                'description'      => 'Framework CSS utility-first que permite construir interfaces rapidamente diretamente no HTML. Alta produtividade sem sair do markup.',
                'url'              => 'https://tailwindcss.com',
                'icon_image'       => 'technologies/icon-tailwind.png',
                'screenshot_image' => 'technologies/screenshot-tailwind.jpg',
                'order'            => 7,
                'is_active'        => true,
            ],
            [
                'name'             => 'Linear',
                'description'      => 'Ferramenta de gerenciamento de projetos e issues ágil e rápida. Favorita de times de produto e engenharia modernos.',
                'url'              => 'https://linear.app',
                'icon_image'       => 'technologies/icon-linear.png',
                'screenshot_image' => 'technologies/screenshot-linear.webp',
                'order'            => 8,
                'is_active'        => true,
            ],
        ];

        foreach ($technologies as $tech) {
            Technology::firstOrCreate(['name' => $tech['name']], $tech);
        }
    }
}
