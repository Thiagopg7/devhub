import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Newsletter from '@/Components/Public/Newsletter';
import PageHero from '@/Components/Public/PageHero';
import Breadcrumb from '@/Components/Public/Breadcrumb';
import StatsStrip from '@/Components/Public/Sobre/StatsStrip';
import ValuesGrid from '@/Components/Public/Sobre/ValuesGrid';
import TracksGrid from '@/Components/Public/Sobre/TracksGrid';
import BuiltWithCta from '@/Components/Public/Sobre/BuiltWithCta';

const HERO_GLOW = {
    width: 700, height: 700, left: '50%', top: -260, transform: 'translateX(-50%)',
    background: 'radial-gradient(circle,rgba(60,189,248,0.09) 0%,transparent 60%)',
};

export default function Sobre() {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';

    return (
        <PublicLayout>
            <Head title={`Sobre Nós — ${siteName}`}>
                <meta name="description" content="Conheça o DevHub — hub de conhecimento técnico em português para devs brasileiros." />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={`Sobre Nós — ${siteName}`} />
                <meta property="og:description" content="Conheça o DevHub — hub de conhecimento técnico em português para devs brasileiros." />
                <meta property="og:url" content={route('sobre')} />
            </Head>

            <PageHero center py="py-20" glowStyle={HERO_GLOW}>
                <Breadcrumb center items={[{ label: 'Home', href: '/' }, { label: 'Sobre Nós' }]} />

                <span className="eyebrow" style={{ justifyContent: 'center' }}>Sobre o {siteName}</span>
                <h1 className="font-display font-semibold text-white leading-tight tracking-tight mt-4 mb-6"
                    style={{ fontSize: 'clamp(34px,5vw,60px)' }}>
                    Um hub de conhecimento para quem{' '}
                    <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--violet)] bg-clip-text text-transparent">
                        constrói com código.
                    </span>
                </h1>
                <p className="max-w-[62ch] mx-auto text-base leading-relaxed" style={{ color: 'var(--text-body)' }}>
                    O {siteName} nasceu de uma ideia simples: reunir, em português e com profundidade técnica,
                    o conteúdo que a gente gostaria de ter encontrado quando começou. Tutoriais testados,
                    decisões de arquitetura explicadas e as ferramentas que realmente usamos no dia a dia.
                </p>
            </PageHero>

            <StatsStrip />
            <ValuesGrid />
            <TracksGrid />
            <BuiltWithCta siteName={siteName} />

            <Newsletter />
        </PublicLayout>
    );
}
