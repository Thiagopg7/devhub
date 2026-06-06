import { useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import PublicLayout from '@/Layouts/PublicLayout';
import ReadingProgressBar from '@/Components/Public/ReadingProgressBar';
import ArticleHeader from '@/Components/Public/Blog/ArticleHeader';
import ArticleToc from '@/Components/Public/Blog/ArticleToc';
import AuthorBox from '@/Components/Public/Blog/AuthorBox';
import PostNav from '@/Components/Public/Blog/PostNav';
import RelatedPosts from '@/Components/Public/Blog/RelatedPosts';
import useArticleContent from '@/hooks/useArticleContent';
import { estimateReadTime } from '@/lib/utils';

export default function BlogShow({ post, prevPost = null, nextPost = null, relatedPosts = [] }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';
    const proseRef = useRef(null);

    const ogTitle       = post.meta_title || post.title;
    const ogDescription = post.meta_description || post.description;
    const readTime      = estimateReadTime(post.content);
    const pageUrl       = typeof window !== 'undefined' ? window.location.href : route('blog.show', post.slug);

    const sanitizedContent = post.content ? DOMPurify.sanitize(post.content) : '';
    const { headings, activeId } = useArticleContent(proseRef, sanitizedContent);

    return (
        <PublicLayout>
            <ReadingProgressBar />

            <Head title={`${ogTitle} — ${siteName}`}>
                {ogDescription && <meta name="description" content={ogDescription} />}
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={ogTitle} />
                {ogDescription && <meta property="og:description" content={ogDescription} />}
                <meta property="og:url" content={route('blog.show', post.slug)} />
                {post.banner_image_url && <meta property="og:image" content={post.banner_image_url} />}
            </Head>

            <ArticleHeader post={post} readTime={readTime} pageUrl={pageUrl} />

            <div style={{ background: 'var(--base)' }}>
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                    <div className="flex gap-14 items-start pt-16 pb-10">

                        <article className="min-w-0 flex-1">
                            {sanitizedContent && (
                                <div
                                    ref={proseRef}
                                    className="prose prose-invert prose-sky max-w-none
                                        prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white prose-headings:scroll-mt-24
                                        prose-h2:text-[28px] prose-h2:mt-[2em] prose-h2:leading-tight
                                        prose-h3:text-[21px] prose-h3:mt-[1.7em]
                                        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-[17px]
                                        prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline
                                        prose-strong:text-white prose-strong:font-bold
                                        prose-code:text-sky-300 prose-code:bg-[var(--surface)] prose-code:border prose-code:border-[rgba(150,178,208,0.15)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.86em] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                                        prose-pre:bg-[#0b1623] prose-pre:border prose-pre:border-[var(--border-2)] prose-pre:rounded-xl prose-pre:p-5
                                        prose-blockquote:border-l-[var(--accent)] prose-blockquote:border-l-2 prose-blockquote:text-slate-400 prose-blockquote:not-italic prose-blockquote:pl-5
                                        prose-img:rounded-2xl prose-img:border prose-img:border-[rgba(150,178,208,0.15)]
                                        prose-li:text-slate-300 prose-li:text-[17px]
                                        prose-ul:gap-2 prose-ol:gap-2"
                                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                                />
                            )}

                            <AuthorBox author={post.user} />
                            <PostNav prevPost={prevPost} nextPost={nextPost} />
                        </article>

                        <ArticleToc headings={headings} activeId={activeId} pageUrl={pageUrl} title={post.title} />
                    </div>
                </div>
            </div>

            <RelatedPosts posts={relatedPosts} />
        </PublicLayout>
    );
}
