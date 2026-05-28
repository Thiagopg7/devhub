<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSobreNos();
        $this->seedPoliticaPrivacidade();
    }

    private function seedSobreNos(): void
    {
        $this->downloadImage('https://picsum.photos/seed/devhub-banner/1200/630', 'pages/sobre-nos-banner.jpg');
        $this->downloadImage('https://picsum.photos/seed/devhub-main/800/600', 'pages/sobre-nos-main.jpg');

        $page = Page::firstOrCreate(
            ['slug' => 'sobre-nos'],
            [
                'title' => 'Sobre Nós',
                'subtitle' => 'Conheça um pouco mais sobre este projeto',
                'slug' => 'sobre-nos',
                'banner_image' => Storage::disk('public')->exists('pages/sobre-nos-banner.jpg') ? 'pages/sobre-nos-banner.jpg' : null,
                'main_image' => Storage::disk('public')->exists('pages/sobre-nos-main.jpg') ? 'pages/sobre-nos-main.jpg' : null,
                'content' => $this->sobreNosContent(),
                'is_active' => true,
                'is_searchable' => true,
                'meta_title' => 'Sobre Nós — DevHub',
                'meta_description' => 'Saiba mais sobre o DevHub, um portfólio e blog de desenvolvimento web focado em PHP, Laravel e React.',
            ]
        );

        if ($page->galleryImages()->doesntExist()) {
            $gallery = [
                ['url' => 'https://picsum.photos/seed/devhub-g1/800/600', 'path' => 'gallery/sobre-nos-1.jpg'],
                ['url' => 'https://picsum.photos/seed/devhub-g2/800/600', 'path' => 'gallery/sobre-nos-2.jpg'],
                ['url' => 'https://picsum.photos/seed/devhub-g3/800/600', 'path' => 'gallery/sobre-nos-3.jpg'],
                ['url' => 'https://picsum.photos/seed/devhub-g4/800/600', 'path' => 'gallery/sobre-nos-4.jpg'],
                ['url' => 'https://picsum.photos/seed/devhub-g5/800/600', 'path' => 'gallery/sobre-nos-5.jpg'],
                ['url' => 'https://picsum.photos/seed/devhub-g6/800/600', 'path' => 'gallery/sobre-nos-6.jpg'],
            ];

            foreach ($gallery as $order => $item) {
                $ok = $this->downloadImage($item['url'], $item['path']);

                if ($ok) {
                    $page->galleryImages()->create(['image' => $item['path'], 'order' => $order]);
                }
            }
        }
    }

    private function seedPoliticaPrivacidade(): void
    {
        Page::firstOrCreate(
            ['slug' => 'politica-de-privacidade'],
            [
                'title' => 'Política de Privacidade',
                'slug' => 'politica-de-privacidade',
                'content' => $this->privacidadeContent(),
                'is_active' => true,
                'is_searchable' => true,
                'meta_title' => 'Política de Privacidade — DevHub',
                'meta_description' => 'Entenda como coletamos, usamos e protegemos suas informações no DevHub.',
            ]
        );
    }

    private function downloadImage(string $url, string $storagePath): bool
    {
        if (Storage::disk('public')->exists($storagePath)) {
            return true;
        }

        try {
            $response = Http::timeout(15)->get($url);

            if ($response->successful()) {
                Storage::disk('public')->put($storagePath, $response->body());

                return true;
            }
        } catch (\Exception) {
            // ignora falhas de rede
        }

        return false;
    }

    private function sobreNosContent(): string
    {
        return <<<'HTML'
<h2>Olá, seja bem-vindo ao DevHub!</h2>
<p>O <strong>DevHub</strong> é um espaço criado para compartilhar conhecimento, projetos e aprendizados sobre desenvolvimento web. Aqui você encontra artigos práticos sobre PHP, Laravel, React, DevOps e muito mais.</p>

<h3>Nossa missão</h3>
<p>Acreditamos que o melhor aprendizado vem da prática e do compartilhamento. Por isso, cada artigo publicado aqui nasceu de experiências reais — seja resolvendo problemas em produção, descobrindo uma nova ferramenta ou simplificando uma arquitetura complexa.</p>

<h3>O que você vai encontrar aqui</h3>
<ul>
    <li><strong>Tutoriais práticos</strong> com código real e exemplos funcionais</li>
    <li><strong>Boas práticas</strong> de desenvolvimento e arquitetura de software</li>
    <li><strong>Ferramentas e tecnologias</strong> do ecossistema web moderno</li>
    <li><strong>Dicas de carreira</strong> para desenvolvedores em crescimento</li>
</ul>

<h3>Stack principal</h3>
<p>Os projetos e exemplos deste blog são construídos principalmente com:</p>
<ul>
    <li>PHP 8.x + Laravel — back-end robusto e elegante</li>
    <li>React.js + Inertia.js — front-end moderno sem API REST separada</li>
    <li>MySQL + Docker — ambiente consistente e portátil</li>
    <li>Tailwind CSS — estilização rápida e responsiva</li>
</ul>

<h3>Entre em contato</h3>
<p>Tem alguma dúvida, sugestão de pauta ou quer trocar uma ideia? Fique à vontade para entrar em contato pelo e-mail ou pelas redes sociais. Adoro boas conversas sobre tecnologia!</p>
HTML;
    }

    private function privacidadeContent(): string
    {
        return <<<'HTML'
<h2>Política de Privacidade</h2>
<p><em>Última atualização: janeiro de 2026</em></p>
<p>Esta Política de Privacidade descreve como o <strong>DevHub</strong> coleta, usa e protege as informações fornecidas pelos visitantes deste site.</p>

<h3>1. Informações coletadas</h3>
<p>Podemos coletar as seguintes informações:</p>
<ul>
    <li>Nome e endereço de e-mail fornecidos voluntariamente ao assinar a newsletter</li>
    <li>Dados de navegação coletados automaticamente (páginas visitadas, tempo de acesso, endereço IP)</li>
    <li>Informações técnicas do dispositivo (tipo de navegador, sistema operacional)</li>
</ul>

<h3>2. Uso das informações</h3>
<p>As informações coletadas são utilizadas para:</p>
<ul>
    <li>Enviar a newsletter com novos artigos e atualizações (somente se você optou por recebê-la)</li>
    <li>Analisar o desempenho e melhorar o conteúdo do site</li>
    <li>Garantir a segurança e o funcionamento adequado da plataforma</li>
</ul>

<h3>3. Compartilhamento de dados</h3>
<p>Não vendemos, trocamos nem transferimos suas informações pessoais para terceiros, exceto quando necessário para operar o site (como provedores de hospedagem) ou quando exigido por lei.</p>

<h3>4. Cookies</h3>
<p>Este site pode utilizar cookies para melhorar a experiência de navegação. Você pode configurar seu navegador para recusar cookies, mas algumas funcionalidades podem não funcionar corretamente.</p>

<h3>5. Cancelamento da newsletter</h3>
<p>Se você assinou nossa newsletter e deseja cancelar, entre em contato pelo e-mail indicado na seção de contato. Processaremos sua solicitação em até 5 dias úteis.</p>

<h3>6. Segurança</h3>
<p>Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição.</p>

<h3>7. Alterações nesta política</h3>
<p>Esta política pode ser atualizada periodicamente. Recomendamos que você revise esta página ocasionalmente para se manter informado sobre eventuais mudanças.</p>

<h3>8. Contato</h3>
<p>Em caso de dúvidas sobre esta Política de Privacidade, entre em contato pelo e-mail disponível na página de contato.</p>
HTML;
    }
}
