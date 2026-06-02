import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import PostCard from '@/Components/Public/PostCard';
import Newsletter from '@/Components/Public/Newsletter';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

export default function BlogCategory({ category, posts }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';
    const { data, current_page, last_page, prev_page_url, next_page_url } = posts;

    const paginatorBtn = "inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl transition-colors";

    return (
        <PublicLayout>
            <Head title={`${category.name} — Blog — ${siteName}`} />

            {/* Pagehead */}
            <section className="relative overflow-hidden" style={{ background: '#0a131e', borderBottom: '1px solid rgba(150,178,208,0.12)' }}>
                <div className="dotgrid" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <nav className="flex items-center gap-2 font-mono text-xs mb-6" style={{ color: '#7b8da3' }}>
                        <Link href="/" className="hover:text-[#3cbdf8] transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-[#3cbdf8] transition-colors">Blog</Link>
                        <span>/</span>
                        <span style={{ color: '#eaf1fa' }}>{category.name}</span>
                    </nav>
                    <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm mb-5 transition-colors hover:text-[#3cbdf8]" style={{ color: '#7b8da3' }}>
                        <ArrowLeft size={15} /> Voltar ao blog
                    </Link>
                    <span className="eyebrow">Categoria</span>
                    <h1 className="font-display font-semibold text-white mt-3 leading-tight tracking-tight" style={{ fontSize: 'clamp(32px,5vw,52px)' }}>
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="mt-3 max-w-[60ch]" style={{ color: '#b6c5d8' }}>{category.description}</p>
                    )}
                </div>
            </section>

            {/* Posts grid */}
            <section style={{ background: '#0a131e' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    {data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.map((post) => <PostCard key={post.id} post={post} />)}
                            </div>

                            {last_page > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-12">
                                    {prev_page_url ? (
                                        <Link href={prev_page_url} className={`${paginatorBtn} hover:text-[#3cbdf8]`}
                                            style={{ border: '1px solid rgba(150,178,208,0.18)', color: '#b6c5d8' }}>
                                            <ChevronLeft size={16} /> Anterior
                                        </Link>
                                    ) : (
                                        <span className={paginatorBtn} style={{ border: '1px solid rgba(150,178,208,0.08)', color: '#7b8da3', cursor: 'not-allowed' }}>
                                            <ChevronLeft size={16} /> Anterior
                                        </span>
                                    )}
                                    <span className="text-sm font-mono" style={{ color: '#7b8da3' }}>Página {current_page} de {last_page}</span>
                                    {next_page_url ? (
                                        <Link href={next_page_url} className={`${paginatorBtn} hover:text-[#3cbdf8]`}
                                            style={{ border: '1px solid rgba(150,178,208,0.18)', color: '#b6c5d8' }}>
                                            Próxima <ChevronRight size={16} />
                                        </Link>
                                    ) : (
                                        <span className={paginatorBtn} style={{ border: '1px solid rgba(150,178,208,0.08)', color: '#7b8da3', cursor: 'not-allowed' }}>
                                            Próxima <ChevronRight size={16} />
                                        </span>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24" style={{ color: '#7b8da3' }}>
                            <p className="text-lg">Nenhum post nesta categoria ainda.</p>
                            <p className="text-sm mt-1">
                                <Link href="/blog" className="hover:underline" style={{ color: '#3cbdf8' }}>Ver todos os posts</Link>
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <Newsletter />
        </PublicLayout>
    );
}
