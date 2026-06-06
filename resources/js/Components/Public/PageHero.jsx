/**
 * Cabeçalho/hero das páginas internas públicas: fundo escuro com dotgrid + glow radial.
 * Centraliza o markup repetido em Agenda, Sobre, Privacidade, Blog e artigos.
 */
const DEFAULT_GLOW = {
    width: 600, height: 600, right: -100, top: -200,
    background: 'radial-gradient(circle,rgba(60,189,248,0.1) 0%,transparent 60%)',
};

export default function PageHero({ children, center = false, py = 'py-16', glowStyle = DEFAULT_GLOW, container }) {
    const inner = container ?? (center ? 'max-w-4xl' : 'max-w-7xl');

    return (
        <section className="relative overflow-hidden" style={{ background: 'var(--base)', borderBottom: '1px solid var(--border)' }}>
            <div className="dotgrid" />
            <div className="absolute pointer-events-none" style={glowStyle} />
            <div className={`relative z-10 ${inner} mx-auto px-5 sm:px-6 lg:px-8 ${py}${center ? ' text-center' : ''}`}>
                {children}
            </div>
        </section>
    );
}
