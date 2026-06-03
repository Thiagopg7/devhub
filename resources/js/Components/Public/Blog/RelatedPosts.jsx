import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import PostCard from '@/Components/Public/PostCard';
import Reveal from '@/Components/Public/Reveal';

/** Seção "Artigos relacionados" ao fim do artigo. */
export default function RelatedPosts({ posts = [] }) {
    if (posts.length === 0) return null;

    return (
        <section style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <Reveal className="flex items-end justify-between gap-4 flex-wrap mb-10">
                    <div>
                        <span className="eyebrow">Continue lendo</span>
                        <h2 className="font-display font-semibold text-white leading-tight tracking-tight mt-3"
                            style={{ fontSize: 'clamp(24px,3vw,34px)' }}>
                            Artigos relacionados
                        </h2>
                    </div>
                    <Link href={route('blog.index')}
                        className="inline-flex items-center gap-2 text-sm font-mono transition-all hover:gap-3"
                        style={{ color: 'var(--accent)' }}>
                        Ver todos
                        <ArrowRight size={14} />
                    </Link>
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((p, i) => (
                        <Reveal key={p.id} delay={i * 100}>
                            <PostCard post={p} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
