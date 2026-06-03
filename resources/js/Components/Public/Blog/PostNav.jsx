import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Reveal from '@/Components/Public/Reveal';

/** Navegação anterior/próximo entre artigos. */
export default function PostNav({ prevPost, nextPost }) {
    if (!prevPost && !nextPost) return null;

    return (
        <Reveal className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {prevPost ? (
                <Link href={route('blog.show', prevPost.slug)}
                    className="group card card-hover flex flex-col gap-2 rounded-2xl p-5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        <ArrowLeft size={12} /> Anterior
                    </span>
                    <span className="text-sm font-semibold text-white leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                        {prevPost.title}
                    </span>
                </Link>
            ) : <div />}

            {nextPost ? (
                <Link href={route('blog.show', nextPost.slug)}
                    className="group card card-hover flex flex-col gap-2 rounded-2xl p-5 text-right">
                    <span className="inline-flex items-center justify-end gap-1.5 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        Próximo <ArrowRight size={12} />
                    </span>
                    <span className="text-sm font-semibold text-white leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                        {nextPost.title}
                    </span>
                </Link>
            ) : <div />}
        </Reveal>
    );
}
