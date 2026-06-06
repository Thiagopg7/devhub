import { Link } from '@inertiajs/react';
import Reveal from '@/Components/Public/Reveal';
import { resolveCategoryIcon } from '@/lib/categoryIcons';

const NUM_WORDS = ['Nenhuma', 'Uma', 'Duas', 'Três', 'Quatro', 'Cinco', 'Seis', 'Sete', 'Oito', 'Nove', 'Dez', 'Onze', 'Doze'];

const numberWord = (n) => NUM_WORDS[n] ?? n;

export default function TracksGrid({ tracks = [] }) {
    if (tracks.length === 0) return null;

    return (
        <section style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Reveal className="mb-3 text-center">
                    <span className="eyebrow" style={{ justifyContent: 'center' }}>O que cobrimos</span>
                </Reveal>
                <Reveal delay={80} className="text-center mb-4">
                    <h2 className="font-display font-semibold text-white leading-tight tracking-tight"
                        style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}>
                        {numberWord(tracks.length)} trilhas de conteúdo
                    </h2>
                </Reveal>
                <Reveal delay={140} className="text-center mb-14">
                    <p className="max-w-[52ch] mx-auto text-base" style={{ color: 'var(--text-muted)' }}>
                        Do primeiro CRUD ao deploy em produção — organizamos tudo por tema para você seguir a sua.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tracks.map((track, i) => {
                        const Icon = resolveCategoryIcon(track.icon);
                        const color = track.color || 'var(--accent)';
                        return (
                            <Reveal key={track.id} delay={i * 80}>
                                <Link href={route('blog.category', track.slug)}
                                    className="card card-hover flex items-center gap-4 rounded-2xl p-5 group">
                                    <div className="w-11 h-11 rounded-xl grid place-items-center shrink-0"
                                        style={{ background: `${color}18`, color }}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-white text-sm">{track.name}</div>
                                        {track.description && (
                                            <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{track.description}</div>
                                        )}
                                    </div>
                                    <span className="font-mono text-xs shrink-0 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                                        {track.posts_count} {track.posts_count === 1 ? 'artigo' : 'artigos'}
                                    </span>
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
