import { Head, Link, usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import PublicLayout from '@/Layouts/PublicLayout';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function estimateReadTime(content) {
    if (!content) return 1;
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

export default function BlogShow({ post }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';

    return (
        <PublicLayout>
            <Head title={`${post.meta_title || post.title} — ${siteName}`}>
                {post.meta_description && (
                    <meta name="description" content={post.meta_description} />
                )}
            </Head>

            {/* Banner */}
            {post.banner_image_url && (
                <div className="w-full h-72 md:h-96 overflow-hidden bg-slate-800">
                    <img
                        src={post.banner_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-slate-400 hover:text-sky-400 text-sm mb-8 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Voltar ao blog
                </Link>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm mb-6">
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {formatDate(post.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {estimateReadTime(post.content)} min de leitura
                    </span>
                    {post.category && (
                        <Link
                            href={`/blog/categoria/${post.category.slug}`}
                            className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 transition-colors"
                        >
                            <Tag size={14} />
                            {post.category.name}
                        </Link>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                    {post.title}
                </h1>

                {post.description && (
                    <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-2 border-sky-400 pl-4">
                        {post.description}
                    </p>
                )}

                {/* Content */}
                {post.content && (
                    <div
                        className="prose prose-invert prose-sky max-w-none
                            prose-headings:text-slate-100
                            prose-p:text-slate-300 prose-p:leading-relaxed
                            prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-slate-100
                            prose-code:text-sky-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
                            prose-blockquote:border-l-sky-400 prose-blockquote:text-slate-400
                            prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                    />
                )}
            </div>
        </PublicLayout>
    );
}
