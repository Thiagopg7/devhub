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
                'name'           => 'Claude AI',
                'description'    => 'Assistente de IA da Anthropic com foco em segurança e confiabilidade. Excelente para escrita, análise, programação e raciocínio complexo.',
                'url'            => 'https://claude.ai',
                'icon_url'       => 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128',
                'screenshot_url' => 'https://deeperinsights.com/wp-content/uploads/2025/09/Claude-AI-Features-Uses-Comparison-to-ChatGPT-1024x674.jpg',
                'order'          => 1,
                'is_active'      => true,
            ],
            [
                'name'           => 'ChatGPT',
                'description'    => 'Modelo de IA da OpenAI que processa texto e gera respostas ou conteúdo com base no que você pede. Ideal para automatizar tarefas e gerar ideias.',
                'url'            => 'https://chatgpt.com',
                'icon_url'       => 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128',
                'screenshot_url' => 'https://www.teachingchannel.com/wp-content/uploads/2023/03/2.2420Blog2028100020C3972050020px29.png',
                'order'          => 2,
                'is_active'      => true,
            ],
            [
                'name'           => 'Figma',
                'description'    => 'Plataforma de design colaborativo para criar interfaces, protótipos e sistemas de design. A ferramenta padrão do mercado para UX/UI.',
                'url'            => 'https://figma.com',
                'icon_url'       => 'https://www.google.com/s2/favicons?domain=figma.com&sz=128',
                'screenshot_url' => 'https://framerusercontent.com/images/Mjs5JFKVxxGZWVhepNzgXEpI.png?width=2000&height=1268',
                'order'          => 3,
                'is_active'      => true,
            ],
            [
                'name'           => 'GitHub Copilot',
                'description'    => 'Assistente de código com IA integrado ao seu editor. Sugere linhas, funções e testes em tempo real enquanto você programa.',
                'url'            => 'https://github.com/features/copilot',
                'icon_url'       => 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
                'screenshot_url' => 'https://images.ctfassets.net/8aevphvgewt8/2Zamxo7a7F9K9jsTAl2EGA/bce1f04a40536e89ef543cb311f2968b/github-copilot-cli.png',
                'order'          => 4,
                'is_active'      => true,
            ],
            [
                'name'           => 'Notion',
                'description'    => 'Espaço de trabalho all-in-one para notas, documentação, wikis e gerenciamento de projetos. Centraliza o conhecimento da equipe.',
                'url'            => 'https://notion.so',
                'icon_url'       => 'https://www.google.com/s2/favicons?domain=notion.so&sz=128',
                'screenshot_url' => 'https://images.ctfassets.net/spoqsaf9291f/4WMSDtdzR2zyWWByTFT4vE/13d2321d5d2671bce13e2285d823a2f3/Notion_for_desktop_-_hero.png',
                'order'          => 5,
                'is_active'      => true,
            ],
            [
                'name'           => 'Vercel',
                'description'    => 'Plataforma de deploy e hospedagem focada em frontend. Zero configuração, previews automáticos por branch e edge network global.',
                'url'            => 'https://vercel.com',
                'icon_url'       => 'https://www.google.com/s2/favicons?domain=vercel.com&sz=128',
                'screenshot_url' => 'https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F4pRLTKDLGLcTMFb0NFwXZK%2F09dacaa656e6d55f6ac096360313c572%2FGroup_513639__2_.png&w=1920&q=75',
                'order'          => 6,
                'is_active'      => true,
            ],
            [
                'name'           => 'Tailwind CSS',
                'description'    => 'Framework CSS utility-first que permite construir interfaces rapidamente diretamente no HTML. Alta produtividade sem sair do markup.',
                'url'            => 'https://tailwindcss.com',
                'icon_url'       => 'https://www.google.com/s2/favicons?domain=tailwindcss.com&sz=128',
                'screenshot_url' => 'https://repository-images.githubusercontent.com/130268121/b4fd5300-b585-11ea-8718-1e141e78842e',
                'order'          => 7,
                'is_active'      => true,
            ],
            [
                'name'           => 'Linear',
                'description'    => 'Ferramenta de gerenciamento de projetos e issues ágil e rápida. Favorita de times de produto e engenharia modernos.',
                'url'            => 'https://linear.app',
                'icon_url'       => 'https://www.google.com/s2/favicons?domain=linear.app&sz=128',
                'screenshot_url' => 'https://cdn.prod.website-files.com/64f6d2ace102eb12e147f7a6/69a5638ec90e29fae7a3dab4_6822f732fd15d07761229c19_cleanshot_2025_05_12_at_18_24_00_2x_2x.webp',
                'order'          => 8,
                'is_active'      => true,
            ],
        ];

        foreach ($technologies as $tech) {
            Technology::firstOrCreate(['name' => $tech['name']], $tech);
        }
    }
}
