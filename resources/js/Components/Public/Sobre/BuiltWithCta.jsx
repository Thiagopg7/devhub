import { ArrowRight } from 'lucide-react';
import Reveal from '@/Components/Public/Reveal';
import Button from '@/Components/Public/ui/Button';

export default function BuiltWithCta({ siteName }) {
    return (
        <section style={{ background: 'var(--base)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Reveal className="relative rounded-[22px] overflow-hidden text-center px-8 py-16"
                    style={{ background: 'linear-gradient(135deg,var(--surface),var(--surface-2))', border: '1px solid var(--border-2)' }}>
                    <div className="absolute pointer-events-none" style={{ width: 600, height: 600, left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle,rgba(60,189,248,0.1) 0%,transparent 60%)' }} />

                    <div className="relative z-10 max-w-[560px] mx-auto">
                        <span className="eyebrow" style={{ justifyContent: 'center' }}>Construído com</span>
                        <h2 className="font-display font-semibold text-white leading-tight tracking-tight mt-4 mb-4"
                            style={{ fontSize: 'clamp(26px,3vw,36px)' }}>
                            Praticamos o que escrevemos
                        </h2>
                        <p className="text-base leading-relaxed" style={{ color: 'var(--text-body)' }}>
                            O {siteName} roda em{' '}
                            <strong className="text-white">Laravel</strong> +{' '}
                            <strong className="text-white">React</strong> com Inertia.js,
                            estilizado com Tailwind e servido com MySQL — exatamente a stack que ensinamos.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center mt-8">
                            <Button href="/blog" size="lg">
                                Começar a ler <ArrowRight size={15} />
                            </Button>
                            <Button href="/#newsletter" variant="ghost" size="lg">
                                Assinar a newsletter
                            </Button>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
