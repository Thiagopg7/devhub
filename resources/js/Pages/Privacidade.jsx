import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Reveal from '@/Components/Public/Reveal';
import { Calendar, Info, Mail } from 'lucide-react';

function Section({ id, title, children }) {
    return (
        <section id={id} className="mt-10">
            <h2 className="font-display font-semibold text-white mb-4"
                style={{ fontSize: 'clamp(18px,2.2vw,22px)', borderBottom: '1px solid rgba(150,178,208,0.12)', paddingBottom: '10px' }}>
                {title}
            </h2>
            <div className="space-y-3 text-base leading-relaxed" style={{ color: '#b6c5d8' }}>
                {children}
            </div>
        </section>
    );
}

function Ul({ items }) {
    return (
        <ul className="space-y-2 pl-5">
            {items.map((item, i) => (
                <li key={i} className="relative before:absolute before:-left-4 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#3cbdf8]">
                    {item}
                </li>
            ))}
        </ul>
    );
}

function Ol({ items }) {
    return (
        <ol className="space-y-2 pl-5 list-decimal marker:text-[#3cbdf8] marker:font-semibold">
            {items.map((item, i) => (
                <li key={i}>{item}</li>
            ))}
        </ol>
    );
}

function Callout({ children }) {
    return (
        <div className="flex gap-4 rounded-xl p-5 mt-4"
            style={{ background: 'rgba(60,189,248,0.06)', border: '1px solid rgba(60,189,248,0.2)' }}>
            <Info size={20} className="shrink-0 mt-0.5" style={{ color: '#3cbdf8' }} />
            <p className="text-sm leading-relaxed" style={{ color: '#b6c5d8' }}>{children}</p>
        </div>
    );
}

export default function Privacidade() {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';
    const email    = siteConfig.contact_email || null;

    return (
        <PublicLayout>
            <Head title={`Política de Privacidade — ${siteName}`}>
                <meta name="description" content="Como o DevHub coleta, usa e protege seus dados. Em conformidade com a LGPD." />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={`Política de Privacidade — ${siteName}`} />
                <meta property="og:url" content={route('privacidade')} />
            </Head>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden" style={{ background: '#0a131e', borderBottom: '1px solid rgba(150,178,208,0.12)' }}>
                <div className="dotgrid" />
                <div className="absolute pointer-events-none" style={{ width: 600, height: 600, right: -100, top: -200, background: 'radial-gradient(circle,rgba(60,189,248,0.08) 0%,transparent 60%)' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <nav className="flex items-center gap-2 font-mono text-xs mb-8" style={{ color: '#7b8da3' }}>
                        <Link href="/" className="hover:text-[#3cbdf8] transition-colors">Home</Link>
                        <span>/</span>
                        <span style={{ color: '#eaf1fa' }}>Política de Privacidade</span>
                    </nav>

                    <span className="eyebrow">Transparência &amp; confiança</span>
                    <h1 className="font-display font-semibold text-white leading-tight tracking-tight mt-3 mb-4"
                        style={{ fontSize: 'clamp(34px,5vw,56px)' }}>
                        Política de Privacidade
                    </h1>
                    <p className="max-w-[60ch] mb-5" style={{ color: '#b6c5d8', fontSize: 16 }}>
                        Como o {siteName} coleta, usa e protege seus dados. Em conformidade com a Lei Geral de Proteção de Dados (LGPD).
                    </p>

                    <span className="inline-flex items-center gap-2 font-mono text-xs px-3.5 py-2 rounded-full"
                        style={{ background: '#101f30', border: '1px solid rgba(150,178,208,0.18)', color: '#7b8da3' }}>
                        <Calendar size={13} style={{ color: '#3cbdf8' }} />
                        Última atualização: 1º de junho de 2026
                    </span>
                </div>
            </section>

            {/* ── Content ──────────────────────────────────────────── */}
            <div style={{ background: '#0a131e' }}>
                <Reveal className="max-w-[760px] mx-auto px-4 sm:px-6 py-14 pb-20">

                    <p className="text-base leading-relaxed" style={{ color: '#b6c5d8' }}>
                        O {siteName} valoriza a sua privacidade. Esta política explica, de forma direta, quais dados coletamos
                        quando você usa nosso site, por que coletamos e quais são os seus direitos sobre eles. Ao usar o {siteName},
                        você concorda com as práticas descritas aqui.
                    </p>

                    <Section id="s1" title="1. Dados que coletamos">
                        <p>Coletamos apenas o necessário para oferecer e melhorar nosso conteúdo:</p>
                        <Ul items={[
                            <><strong className="text-white">Dados que você nos fornece</strong> — nome, e-mail e área de atuação, quando você assina nossa newsletter ou preenche um formulário.</>,
                            <><strong className="text-white">Dados de uso</strong> — páginas visitadas, tempo de leitura e cliques, coletados de forma anônima e agregada para entender o que é útil.</>,
                            <><strong className="text-white">Dados técnicos</strong> — tipo de navegador, dispositivo e endereço IP aproximado, usados para segurança e estatísticas.</>,
                        ]} />
                    </Section>

                    <Section id="s2" title="2. Como usamos seus dados">
                        <p>Os dados coletados servem exclusivamente para:</p>
                        <Ul items={[
                            'Enviar a newsletter e comunicações que você solicitou;',
                            'Personalizar e recomendar conteúdo relevante para o seu perfil;',
                            'Entender quais artigos e trilhas geram mais valor;',
                            'Garantir a segurança e o bom funcionamento da plataforma.',
                        ]} />
                        <p>Nunca vendemos seus dados pessoais a terceiros. Ponto.</p>
                    </Section>

                    <Section id="s3" title="3. Cookies">
                        <p>
                            Usamos cookies para lembrar suas preferências e medir o desempenho do site. Você pode desativá-los
                            a qualquer momento nas configurações do seu navegador — algumas funcionalidades podem deixar de
                            funcionar como esperado.
                        </p>
                        <Callout>
                            <strong className="text-white">Cookies essenciais</strong> mantêm o site funcionando (preferências, sessão).{' '}
                            <strong className="text-white">Cookies analíticos</strong> nos ajudam a melhorar — e são sempre anônimos.
                        </Callout>
                    </Section>

                    <Section id="s4" title="4. Compartilhamento">
                        <p>
                            Compartilhamos dados apenas com prestadores de serviço que nos ajudam a operar — como plataformas de
                            envio de e-mail e ferramentas de análise. Todos seguem padrões rigorosos de proteção de dados e só
                            acessam o estritamente necessário.
                        </p>
                    </Section>

                    <Section id="s5" title="5. Seus direitos (LGPD)">
                        <p>De acordo com a LGPD, você tem o direito de:</p>
                        <Ol items={[
                            'Confirmar a existência de tratamento dos seus dados;',
                            'Acessar, corrigir ou atualizar seus dados a qualquer momento;',
                            'Solicitar a exclusão dos seus dados pessoais;',
                            'Revogar o consentimento e cancelar a newsletter em um clique.',
                        ]} />
                        <p>Para exercer qualquer um desses direitos, basta entrar em contato pelo e-mail no fim desta página.</p>
                    </Section>

                    <Section id="s6" title="6. Segurança">
                        <p>
                            Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado,
                            perda ou alteração. Ainda assim, nenhum sistema é 100% infalível — por isso só coletamos o mínimo
                            necessário e tratamos cada dado com responsabilidade.
                        </p>
                    </Section>

                    <Section id="s7" title="7. Alterações nesta política">
                        <p>
                            Podemos atualizar esta política periodicamente para refletir mudanças na lei ou em nossas práticas.
                            Quando isso acontecer, atualizamos a data no topo da página. Mudanças significativas serão comunicadas
                            por e-mail aos assinantes.
                        </p>
                    </Section>

                    <Section id="s8" title="8. Fale com a gente">
                        <p>Tem alguma dúvida sobre como tratamos seus dados? Estamos à disposição.</p>

                        <div className="flex items-center gap-4 rounded-2xl p-6 mt-5"
                            style={{ background: 'linear-gradient(135deg,#101f30,#15243a)', border: '1px solid rgba(150,178,208,0.18)' }}>
                            <div className="w-12 h-12 rounded-xl grid place-items-center shrink-0"
                                style={{ background: 'rgba(60,189,248,0.1)', color: '#3cbdf8' }}>
                                <Mail size={22} />
                            </div>
                            <div>
                                <div className="font-display font-semibold text-white text-base">
                                    Encarregado de Dados — {siteName}
                                </div>
                                {email ? (
                                    <a href={`mailto:${email}`}
                                        className="text-sm mt-0.5 block transition-colors hover:text-[#76d3ff]"
                                        style={{ color: '#3cbdf8' }}>
                                        {email}
                                    </a>
                                ) : (
                                    <span className="text-sm mt-0.5 block" style={{ color: '#7b8da3' }}>
                                        E-mail não configurado
                                    </span>
                                )}
                            </div>
                        </div>
                    </Section>

                </Reveal>
            </div>
        </PublicLayout>
    );
}
