<?php

namespace Database\Seeders;

use App\Models\Technology;
use Database\Seeders\Support\SvgImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TechnologySeeder extends Seeder
{
    public function run(): void
    {
        $technologies = [
            [
                'name' => 'Claude AI',
                'description' => 'Assistente de IA da Anthropic com foco em segurança e confiabilidade. Excelente para escrita, análise, programação e raciocínio complexo.',
                'url' => 'https://claude.ai',
                'color' => '#D97757',
            ],
            [
                'name' => 'ChatGPT',
                'description' => 'Modelo de IA da OpenAI que processa texto e gera respostas ou conteúdo com base no que você pede. Ideal para automatizar tarefas e gerar ideias.',
                'url' => 'https://chatgpt.com',
                'color' => '#10A37F',
            ],
            [
                'name' => 'Figma',
                'description' => 'Plataforma de design colaborativo para criar interfaces, protótipos e sistemas de design. A ferramenta padrão do mercado para UX/UI.',
                'url' => 'https://figma.com',
                'color' => '#F24E1E',
            ],
            [
                'name' => 'GitHub Copilot',
                'description' => 'Assistente de código com IA integrado ao seu editor. Sugere linhas, funções e testes em tempo real enquanto você programa.',
                'url' => 'https://github.com/features/copilot',
                'color' => '#8957E5',
            ],
            [
                'name' => 'Notion',
                'description' => 'Espaço de trabalho all-in-one para notas, documentação, wikis e gerenciamento de projetos. Centraliza o conhecimento da equipe.',
                'url' => 'https://notion.so',
                'color' => '#4B5563',
            ],
            [
                'name' => 'Vercel',
                'description' => 'Plataforma de deploy e hospedagem focada em frontend. Zero configuração, previews automáticos por branch e edge network global.',
                'url' => 'https://vercel.com',
                'color' => '#0EA5E9',
            ],
            [
                'name' => 'Tailwind CSS',
                'description' => 'Framework CSS utility-first que permite construir interfaces rapidamente diretamente no HTML. Alta produtividade sem sair do markup.',
                'url' => 'https://tailwindcss.com',
                'color' => '#38BDF8',
            ],
            [
                'name' => 'Linear',
                'description' => 'Ferramenta de gerenciamento de projetos e issues ágil e rápida. Favorita de times de produto e engenharia modernos.',
                'url' => 'https://linear.app',
                'color' => '#5E6AD2',
            ],
        ];

        foreach ($technologies as $order => $tech) {
            $slug = Str::slug($tech['name']);

            $icon = "technologies/icon-{$slug}.svg";
            $screenshot = "technologies/screenshot-{$slug}.svg";

            $this->ensure($icon, SvgImage::logo($tech['name'], $tech['color']));
            $this->ensure($screenshot, SvgImage::wide($tech['name'], parse_url($tech['url'], PHP_URL_HOST), $tech['color']));

            Technology::firstOrCreate(
                ['name' => $tech['name']],
                [
                    'description' => $tech['description'],
                    'url' => $tech['url'],
                    'icon_image' => $icon,
                    'screenshot_image' => $screenshot,
                    'order' => $order + 1,
                    'is_active' => true,
                ]
            );
        }
    }

    /** Grava o SVG no storage público apenas se ainda não existir (idempotente / storage efêmero). */
    private function ensure(string $path, string $svg): void
    {
        if (! Storage::disk('public')->exists($path)) {
            Storage::disk('public')->put($path, $svg);
        }
    }
}
