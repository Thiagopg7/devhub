import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import PostCard from '@/Components/Public/PostCard';
import Newsletter from '@/Components/Public/Newsletter';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

export default function BlogIndex({ posts, filters = {} }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';
    const { data, current_page, last_page, prev_page_url, next_page_url } = posts;

    const [busca, setBusca] = useState(filters.busca || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('blog.index'), busca.trim() ? { busca: busca.trim() } : {}, {
            preserveState: true, replace: true,
        });
    };

    const limparBusca = () => {
        setBusca('');
        router.get(route('blog.index'), {}, { preserveState: true, replace: true });
    };

    const paginatorBtn = "inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl transition-colors";

    return (
        <PublicLayout>
            <Head title={`Blog — ${siteName}`}>
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={`Blog — ${siteName}`} />
                <meta property="og:description" content="Artigos sobre tecnologia, inovação e negócios" />
                <meta property="og:url" content={route('blog.index')} />
            </Head>

            {/* Page header — pagehead strip */}
            <section className="relative overflow-hidden" style={{ background: '#0a131e', borderBottom: '1px solid rgba(150,178,208,0.12)' }}>
                <div className="dotgrid" />
                <div className="absolute pointer-events-none" style={{ width: 600, height: 600, right: -100, top: -200, background: 'radial-gradient(circle,rgba(60,189,248,0.1) 0%,transparent 60%)' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 font-mono text-xs mb-8" style={{ color: '#7b8da3' }}>
                        <Link href="/" className="hover:text-[#3cbdf8] transition-colors">Home</Link>
                        <span>/</span>
                        <span style={{ color: '#eaf1fa' }}>Blog</span>
                    </nav>

                    <span className="eyebrow">O hub de conteúdo</span>
                    <h1 className="font-display font-semibold text-white leading-tight tracking-tight mt-3 mb-4"
                        style={{ fontSize: 'clamp(34px,5vw,56px)' }}>
                        Todos os artigos
                    </h1>
                    <p className="mb-8 max-w-[60ch]" style={{ color: '#b6c5d8', fontSize: 16 }}>
                        Tutoriais, guias e reflexões sobre desenvolvimento web, arquitetura, banco de dados e carreira.
                    </p>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#7b8da3' }} />
                            <input
                                type="search"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar artigos…"
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm placeholder-[#7b8da3] focus:outline-none transition-colors"
                                style={{ background: '#101f30', border: '1px solid rgba(150,178,208,0.18)', color: '#eaf1fa' }}
                                onFocus={e => e.target.style.borderColor='#3cbdf8'}
                                onBlur={e => e.target.style.borderColor='rgba(150,178,208,0.18)'}
                            />
                        </div>
                        <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)', color: '#03121d' }}>
                            Buscar
                        </button>
                        {filters.busca && (
                            <button type="button" onClick={limparBusca}
                                className="px-3 py-2.5 rounded-xl transition-colors hover:text-white"
                                style={{ border: '1px solid rgba(150,178,208,0.18)', color: '#7b8da3' }}
                                title="Limpar busca">
                                <X size={16} />
                            </button>
                        )}
                    </form>

                    {/* Count */}
                    {!filters.busca && (
                        <p className="mt-4 font-mono text-xs" style={{ color: '#7b8da3' }}>{data.length} artigos encontrados</p>
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

                            {/* Pagination */}
                            {last_page > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-12">
                                    {prev_page_url ? (
                                        <Link href={prev_page_url}
                                            className={`${paginatorBtn} hover:text-[#3cbdf8]`}
                                            style={{ border: '1px solid rgba(150,178,208,0.18)', color: '#b6c5d8' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor='#3cbdf8'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor='rgba(150,178,208,0.18)'}>
                                            <ChevronLeft size={16} /> Anterior
                                        </Link>
                                    ) : (
                                        <span className={paginatorBtn} style={{ border: '1px solid rgba(150,178,208,0.08)', color: '#7b8da3', cursor: 'not-allowed' }}>
                                            <ChevronLeft size={16} /> Anterior
                                        </span>
                                    )}

                                    <span className="text-sm font-mono" style={{ color: '#7b8da3' }}>
                                        Página {current_page} de {last_page}
                                    </span>

                                    {next_page_url ? (
                                        <Link href={next_page_url}
                                            className={`${paginatorBtn} hover:text-[#3cbdf8]`}
                                            style={{ border: '1px solid rgba(150,178,208,0.18)', color: '#b6c5d8' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor='#3cbdf8'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor='rgba(150,178,208,0.18)'}>
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
                            {filters.busca ? (
                                <>
                                    <p className="text-lg">Nenhum resultado para <span style={{ color: '#eaf1fa' }}>"{filters.busca}"</span>.</p>
                                    <button onClick={limparBusca} className="text-sm mt-2 transition-colors hover:text-[#76d3ff]" style={{ color: '#3cbdf8' }}>
                                        Limpar busca
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-lg">Nenhuma publicação disponível ainda.</p>
                                    <p className="text-sm mt-1">Volte em breve!</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Newsletter />
        </PublicLayout>
    );
}
