import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Reveal from '@/Components/Public/Reveal';
import SectionHead from '@/Components/Public/SectionHead';
import Button from '@/Components/Public/ui/Button';
import AuthorBadge from '@/Components/Public/ui/AuthorBadge';
import { formatDate, estimateReadTime } from '@/lib/utils';

export default function FeaturedPost({ post }) {
    if (!post) return null;

    return (
        <section style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Reveal><SectionHead eyebrow="Destaque da semana" title="Leitura obrigatória" linkHref="/blog" linkLabel="Ver todos os destaques" /></Reveal>

                <Reveal delay={150} as="article" className="grid md:grid-cols-[1.15fr_1fr] rounded-[22px] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,var(--surface),var(--surface-2))', border: '1px solid var(--border)', boxShadow: '0 18px 40px -22px rgba(0,0,0,0.7)' }}>

                    <div className="relative min-h-[320px] overflow-hidden">
                        {post.banner_image_url ? (
                            <img src={post.banner_image_url} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 grid place-items-center" style={{ background: 'linear-gradient(135deg,var(--surface),var(--base))' }}>
                                <span className="font-display font-semibold text-2xl text-center px-8 leading-tight" style={{ color: 'var(--accent)', opacity: 0.8 }}>
                                    {post.title}
                                </span>
                            </div>
                        )}
                        {post.category && (
                            <span className="absolute top-4 left-4 z-10 font-mono text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full font-semibold"
                                style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
                                {post.category.name}
                            </span>
                        )}
                    </div>

                    <div className="p-10 flex flex-col justify-center">
                        <div className="inline-flex items-center flex-wrap gap-3 font-mono text-[13px] mb-4 leading-none" style={{ color: 'var(--text-muted)' }}>
                            {post.category && <span style={{ color: 'var(--accent)' }}>{post.category.name}</span>}
                            <span aria-hidden="true">•</span>
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar size={12} style={{ display: 'block', flexShrink: 0 }} />
                                {formatDate(post.created_at)}
                            </span>
                            <span aria-hidden="true">•</span>
                            <span className="inline-flex items-center gap-1.5">
                                <Clock size={12} style={{ display: 'block', flexShrink: 0 }} />
                                {estimateReadTime(post.content)} min
                            </span>
                        </div>
                        <h3 className="font-display font-semibold text-white leading-tight tracking-tight mb-3" style={{ fontSize: 'clamp(26px,2.8vw,34px)' }}>
                            {post.title}
                        </h3>
                        {post.description && (
                            <p className="text-base mb-8 max-w-[50ch]" style={{ color: 'var(--text-body)' }}>{post.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-auto">
                            <AuthorBadge size="md" author={post.user} />
                            <Button href={route('blog.show', post.slug)} variant="ghost" className="ml-auto">
                                Ler artigo <ArrowRight size={14} />
                            </Button>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
