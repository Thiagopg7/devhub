import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import HeroBanner from '@/Components/Public/HeroBanner';
import TechCarousel from '@/Components/Public/TechCarousel';
import StackMarquee from '@/Components/Public/StackMarquee';
import Newsletter from '@/Components/Public/Newsletter';
import FeaturedPost from '@/Components/Public/Home/FeaturedPost';
import PostsExplorer from '@/Components/Public/Home/PostsExplorer';
import EventsPreview from '@/Components/Public/Home/EventsPreview';
import Testimonials from '@/Components/Public/Home/Testimonials';

export default function Home({ featuredPosts = [], technologies = [], upcomingEvents = [], testimonials = [], stackItems = [] }) {
    const { siteConfig = {} } = usePage().props;
    const siteName  = siteConfig.site_name || 'DevHub';
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

            <FeaturedPost post={featuredPosts[0] ?? null} />

            <PostsExplorer posts={featuredPosts} />

            <StackMarquee items={stackItems} />

            <div style={{ background: 'var(--panel)' }}>
                <TechCarousel technologies={technologies} />
            </div>

            <EventsPreview events={upcomingEvents} />

            <Testimonials testimonials={testimonials} />

            <Newsletter />
        </PublicLayout>
    );
}
