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
            preserveState: true,
            replace: true,
        });
    };

    const limparBusca = () => {
        setBusca('');
        router.get(route('blog.index'), {}, { preserveState: true, replace: true });
    };

    return (
        <PublicLayout>
            <Head title={`Blog — ${siteName}`} />

            {/* Page header */}
            <div className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
                    <p className="text-slate-400 mb-6">
                        Artigos sobre tecnologia, inovação e negócios
                    </p>

                    <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar artigos..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm rounded-lg transition-colors"
                        >
                            Buscar
                        </button>
                        {filters.busca && (
                            <button
                                type="button"
                                onClick={limparBusca}
                                className="px-3 py-2 border border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                title="Limpar busca"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Posts grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                {data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {last_page > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-12">
                                {prev_page_url ? (
                                    <Link
                                        href={prev_page_url}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-slate-300 border border-slate-700 rounded-lg hover:border-sky-400 hover:text-sky-400 transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                        Anterior
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 border border-slate-800 rounded-lg cursor-not-allowed">
                                        <ChevronLeft size={16} />
                                        Anterior
                                    </span>
                                )}

                                <span className="text-slate-400 text-sm">
                                    Página {current_page} de {last_page}
                                </span>

                                {next_page_url ? (
                                    <Link
                                        href={next_page_url}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-slate-300 border border-slate-700 rounded-lg hover:border-sky-400 hover:text-sky-400 transition-colors"
                                    >
                                        Próxima
                                        <ChevronRight size={16} />
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 border border-slate-800 rounded-lg cursor-not-allowed">
                                        Próxima
                                        <ChevronRight size={16} />
                                    </span>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-24 text-slate-500">
                        {filters.busca ? (
                            <>
                                <p className="text-lg">Nenhum resultado para <span className="text-slate-300">"{filters.busca}"</span>.</p>
                                <button onClick={limparBusca} className="text-sm text-sky-400 hover:text-sky-300 mt-2 transition-colors">
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
            </section>

            <Newsletter />
        </PublicLayout>
    );
}
