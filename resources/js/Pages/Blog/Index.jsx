import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import PostCard from '@/Components/Public/PostCard';
// import Newsletter from '@/Components/Public/Newsletter'; // desativado temporariamente — aguardando LGPD
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BlogIndex({ posts }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';
    const { data, current_page, last_page, prev_page_url, next_page_url } = posts;

    return (
        <PublicLayout>
            <Head title={`Blog — ${siteName}`} />

            {/* Page header */}
            <div className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
                    <p className="text-slate-400">
                        Artigos sobre tecnologia, inovação e negócios
                    </p>
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
                        <p className="text-lg">Nenhuma publicação disponível ainda.</p>
                        <p className="text-sm mt-1">Volte em breve!</p>
                    </div>
                )}
            </section>

            {/* <Newsletter /> */}{/* desativado temporariamente — aguardando LGPD */}
        </PublicLayout>
    );
}
