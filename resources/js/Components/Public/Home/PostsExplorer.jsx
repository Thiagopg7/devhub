import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import PostCard from '@/Components/Public/PostCard';
import Reveal from '@/Components/Public/Reveal';
import SectionHead from '@/Components/Public/SectionHead';
import Pill from '@/Components/Public/ui/Pill';
import { categoryIcon } from '@/lib/utils';

export default function PostsExplorer({ posts = [] }) {
    const allCategories = [...new Set(posts.map(p => p.category?.name).filter(Boolean))];
    const [activeFilter, setActiveFilter] = useState('all');

    const visiblePosts = activeFilter === 'all'
        ? posts
        : posts.filter(p => p.category?.name === activeFilter);

    return (
        <section style={{ background: 'var(--base)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Reveal>
                    <SectionHead
                        eyebrow="Últimas publicações"
                        title="Explore por trilha"
                        subtitle="Escolha um tema e mergulhe. Filtre os artigos pela área que você quer dominar."
                        linkHref="/blog"
                        linkLabel="Ver todos"
                    />
                </Reveal>

                <Reveal delay={100}>
                    {allCategories.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-9">
                            {[{ label: 'Todos', value: 'all' }, ...allCategories.map(c => ({ label: c, value: c }))].map(({ label, value }) => {
                                const active = activeFilter === value;
                                const Icon = categoryIcon(value);
                                return (
                                    <Pill key={value} active={active} onClick={() => setActiveFilter(value)}>
                                        <Icon size={14} />
                                        {label}
                                    </Pill>
                                );
                            })}
                        </div>
                    )}

                    {visiblePosts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visiblePosts.map((post) => <PostCard key={post.id} post={post} />)}
                        </div>
                    ) : (
                        <p className="text-center py-16 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
                            Nenhum artigo nesta trilha ainda. Volte em breve. :)
                        </p>
                    )}

                    <div className="sm:hidden mt-8 text-center">
                        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--accent)' }}>
                            Ver todos os posts <ArrowRight size={16} />
                        </Link>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
