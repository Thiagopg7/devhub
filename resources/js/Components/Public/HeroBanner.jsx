import { Link } from '@inertiajs/react';
import { ArrowRight, Zap } from 'lucide-react';

export default function HeroBanner() {
    return (
        <section className="relative overflow-hidden bg-slate-900">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950" />

            {/* Grid dot pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `radial-gradient(circle, #38BDF8 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Glow effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sky-400/8 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
                <div className="max-w-3xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-400 text-xs font-semibold mb-6">
                        <Zap size={12} />
                        Hub de Inovação & Tecnologia
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                        Conectando ideias,{' '}
                        <span className="text-sky-400">acelerando</span>{' '}
                        o futuro
                    </h1>

                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                        Artigos, insights e tendências sobre tecnologia, inovação e negócios —
                        para quem quer estar à frente.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-400 text-slate-900 font-semibold rounded-lg hover:bg-sky-300 transition-colors"
                        >
                            Explorar Posts
                            <ArrowRight size={18} />
                        </Link>
                        <a
                            href="#newsletter"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-sky-400 hover:text-sky-400 transition-colors"
                        >
                            Receber novidades
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
