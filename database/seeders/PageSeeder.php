<?php

namespace Database\Seeders;

use App\Models\Page;
use Database\Seeders\Support\SvgImage;
use Illuminate\Database\Seeder;
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
        $this->ensureSvg('pages/sobre-nos-main.svg', SvgImage::wide('DevHub', 'Sobre Nós', '#3CBDF8'));

        // withTrashed: se a página foi soft-deletada, restaura em vez de colidir no índice unique do slug
        $page = Page::withTrashed()->firstOrCreate(
            ['slug' => 'sobre-nos'],
            [
                'title' => 'Sobre Nós',
                'subtitle' => 'Conheça um pouco mais sobre este projeto',
                'slug' => 'sobre-nos',
                'main_image' => 'pages/sobre-nos-main.svg',
                'content' => $this->sobreNosContent(),
                'is_active' => true,
                'is_searchable' => true,
                'meta_title' => 'Sobre Nós — DevHub',
                'meta_description' => 'Saiba mais sobre o DevHub, um portfólio e blog de desenvolvimento web focado em PHP, Laravel e React.',
            ]
        );

        if ($page->trashed()) {
            $page->restore();
        }

        if ($page->galleryImages()->doesntExist()) {
            $palette = ['#3CBDF8', '#7B86FF', '#2FD9C2', '#F0B65A', '#E5359F', '#8AF0E2'];

            foreach ($palette as $order => $color) {
                $path = 'gallery/sobre-nos-'.($order + 1).'.svg';
                $this->ensureSvg($path, SvgImage::wide('DevHub', 'Galeria', $color, 800, 600));
                $page->galleryImages()->create(['image' => $path, 'order' => $order]);
            }
        }
    }

    private function seedPoliticaPrivacidade(): void
    {
        // Remove a variante antiga de slug, se existir (não destrói a página atual)
        Page::withTrashed()->where('slug', 'politica-de-privacidade')->each(fn ($p) => $p->forceDelete());

        $page = Page::withTrashed()->firstOrCreate(
            ['slug' => 'politica-privacidade'],
            [
                'title' => 'Política de Privacidade',
                'subtitle' => 'Como o DevHub coleta, usa e protege seus dados. Em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
                'eyebrow' => 'Transparência & confiança',
                'slug' => 'politica-privacidade',
                'content' => $this->privacidadeContent(),
                'is_active' => true,
                'is_searchable' => true,
                'meta_title' => 'Política de Privacidade',
                'meta_description' => 'Como o DevHub coleta, usa e protege seus dados. Em conformidade com a LGPD.',
            ]
        );

        if ($page->trashed()) {
            $page->restore();
        }
    }

    /** Grava o SVG no storage público apenas se ainda não existir (idempotente / storage efêmero). */
    private function ensureSvg(string $path, string $svg): void
    {
        if (! Storage::disk('public')->exists($path)) {
            Storage::disk('public')->put($path, $svg);
        }
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
<p>O DevHub valoriza a sua privacidade. Esta política explica, de forma direta, quais dados coletamos quando você usa nosso site, por que coletamos e quais são os seus direitos sobre eles. Ao usar o DevHub, você concorda com as práticas descritas aqui.</p>

<h2>1. Dados que coletamos</h2>
<p>Coletamos apenas o necessário para oferecer e melhorar nosso conteúdo:</p>
<ul>
<li><strong>Dados que você nos fornece</strong> — nome, e-mail e área de atuação, quando você assina nossa newsletter ou preenche um formulário.</li>
<li><strong>Dados de uso</strong> — páginas visitadas, tempo de leitura e cliques, coletados de forma anônima e agregada para entender o que é útil.</li>
<li><strong>Dados técnicos</strong> — tipo de navegador, dispositivo e endereço IP aproximado, usados para segurança e estatísticas.</li>
</ul>

<h2>2. Como usamos seus dados</h2>
<p>Os dados coletados servem exclusivamente para:</p>
<ul>
<li>Enviar a newsletter e comunicações que você solicitou;</li>
<li>Personalizar e recomendar conteúdo relevante para o seu perfil;</li>
<li>Entender quais artigos e trilhas geram mais valor;</li>
<li>Garantir a segurança e o bom funcionamento da plataforma.</li>
</ul>
<p>Nunca vendemos seus dados pessoais a terceiros. Ponto.</p>

<h2>3. Cookies</h2>
<p>Usamos cookies para lembrar suas preferências e medir o desempenho do site. Você pode desativá-los a qualquer momento nas configurações do seu navegador — algumas funcionalidades podem deixar de funcionar como esperado.</p>
<blockquote><strong>Cookies essenciais</strong> mantêm o site funcionando (preferências, sessão). <strong>Cookies analíticos</strong> nos ajudam a melhorar — e são sempre anônimos.</blockquote>

<h2>4. Compartilhamento</h2>
<p>Compartilhamos dados apenas com prestadores de serviço que nos ajudam a operar — como plataformas de envio de e-mail e ferramentas de análise. Todos seguem padrões rigorosos de proteção de dados e só acessam o estritamente necessário.</p>

<h2>5. Seus direitos (LGPD)</h2>
<p>De acordo com a LGPD, você tem o direito de:</p>
<ol>
<li>Confirmar a existência de tratamento dos seus dados;</li>
<li>Acessar, corrigir ou atualizar seus dados a qualquer momento;</li>
<li>Solicitar a exclusão dos seus dados pessoais;</li>
<li>Revogar o consentimento e cancelar a newsletter em um clique.</li>
</ol>
<p>Para exercer qualquer um desses direitos, basta entrar em contato pelo e-mail no fim desta página.</p>

<h2>6. Segurança</h2>
<p>Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração. Ainda assim, nenhum sistema é 100% infalível — por isso só coletamos o mínimo necessário e tratamos cada dado com responsabilidade.</p>

<h2>7. Alterações nesta política</h2>
<p>Podemos atualizar esta política periodicamente para refletir mudanças na lei ou em nossas práticas. Quando isso acontecer, atualizamos a data no topo da página. Mudanças significativas serão comunicadas por e-mail aos assinantes.</p>

<h2>8. Fale com a gente</h2>
<p>Tem alguma dúvida sobre como tratamos seus dados? Estamos à disposição.</p>
<div class="contact-card">
<div>
<div class="contact-card-title">Encarregado de Dados — DevHub</div>
<a href="mailto:contato@devhub.com.br">contato@devhub.com.br</a>
</div>
</div>
HTML;
    }
}
