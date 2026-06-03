import { Head, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import PostCard from '@/Components/Public/PostCard';
import Newsletter from '@/Components/Public/Newsletter';
import PageHero from '@/Components/Public/PageHero';
import Breadcrumb from '@/Components/Public/Breadcrumb';
import BlogFilters from '@/Components/Public/Blog/BlogFilters';
import Pagination from '@/Components/Public/Blog/Pagination';

export default function BlogIndex({ posts, filters = {}, categories = [], totalPosts = 0 }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';
    const { data, current_page, last_page, prev_page_url, next_page_url } = posts;

    const pageUrl = (page) => route('blog.index', {
        page,
        ...(filters.busca ? { busca: filters.busca } : {}),
        ...(filters.categoria ? { categoria: filters.categoria } : {}),
    });

    return (
        <PublicLayout>
            <Head title={`Blog — ${siteName}`}>
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={`Blog — ${siteName}`} />
                <meta property="og:description" content="Artigos sobre tecnologia, inovação e negócios" />
                <meta property="og:url" content={route('blog.index')} />
            </Head>

            <PageHero>
                <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />

                <span className="eyebrow">O hub de conteúdo</span>
                <h1 className="font-display font-semibold text-white leading-tight tracking-tight mt-3 mb-4"
                    style={{ fontSize: 'clamp(34px,5vw,56px)' }}>
                    Todos os artigos
                </h1>
                <p className="mb-8 max-w-[60ch]" style={{ color: 'var(--text-body)', fontSize: 16 }}>
                    Tutoriais, guias e reflexões sobre desenvolvimento web, arquitetura, banco de dados e carreira.{' '}
                    Busque por palavra-chave ou filtre por trilha.
                </p>

                <BlogFilters filters={filters} categories={categories} totalPosts={totalPosts} />
            </PageHero>

            <section style={{ background: 'var(--base)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    {data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.map((post) => <PostCard key={post.id} post={post} />)}
                            </div>

                            <Pagination
                                currentPage={current_page}
                                lastPage={last_page}
                                prevUrl={prev_page_url}
                                nextUrl={next_page_url}
                                pageUrl={pageUrl}
                            />
                        </>
                    ) : (
                        <div className="text-center py-24" style={{ color: 'var(--text-muted)' }}>
                            {filters.busca || filters.categoria ? (
                                <>
                                    <p className="text-lg">
                                        Nenhum resultado encontrado
                                        {filters.busca && <> para <span style={{ color: 'var(--text-bright)' }}>"{filters.busca}"</span></>}
                                        {filters.categoria && <> nesta categoria</>}.
                                    </p>
                                    <button onClick={() => router.get(route('blog.index'))} className="text-sm mt-2 transition-colors hover:text-[var(--accent-hi)]" style={{ color: 'var(--accent)' }}>
                                        Limpar filtros
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
