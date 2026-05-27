import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import HeroBanner from '@/Components/Public/HeroBanner';
import PostCard from '@/Components/Public/PostCard';
import TechCarousel from '@/Components/Public/TechCarousel';
import Newsletter from '@/Components/Public/Newsletter';
import { ArrowRight } from 'lucide-react';

export default function Home({ featuredPosts = [], technologies = [] }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';

    const homeTitle = `${siteName} — Hub de Inovação e Tecnologia`;

    return (
        <PublicLayout>
            <Head title={homeTitle}>
                {siteConfig.site_tagline && <meta name="description" content={siteConfig.site_tagline} />}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={homeTitle} />
                {siteConfig.site_tagline && <meta property="og:description" content={siteConfig.site_tagline} />}
                <meta property="og:url" content={route('home')} />
            </Head>

            <HeroBanner />

            {/* Featured Posts */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Últimas Publicações</h2>
                        <p className="text-slate-400 text-sm mt-1">O que há de mais recente no hub</p>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden sm:inline-flex items-center gap-1.5 text-sky-400 text-sm font-medium hover:gap-3 transition-all"
                    >
                        Ver todos
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {featuredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-500">
                        <p className="text-lg">Nenhuma publicação disponível ainda.</p>
                        <p className="text-sm mt-1">Volte em breve!</p>
                    </div>
                )}

                <div className="sm:hidden mt-8 text-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 text-sky-400 text-sm font-medium"
                    >
                        Ver todos os posts
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-slate-800" />

            <TechCarousel technologies={technologies} />

            <Newsletter />
        </PublicLayout>
    );
}
