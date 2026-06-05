import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import DOMPurify from "dompurify";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import PublicLayout from "@/Layouts/PublicLayout";
import PageHero from "@/Components/Public/PageHero";
import Breadcrumb from "@/Components/Public/Breadcrumb";
import Reveal from "@/Components/Public/Reveal";
import { Calendar } from "lucide-react";

const PROSE = `prose prose-invert max-w-none
    prose-headings:font-display prose-headings:font-semibold prose-headings:text-white
    prose-h2:text-[22px] prose-h2:border-b prose-h2:border-[var(--border)] prose-h2:pb-2.5 prose-h2:mt-10 prose-h2:mb-4
    prose-h3:text-lg prose-h3:mt-8
    prose-p:text-[var(--text-body)] prose-p:leading-relaxed
    prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
    prose-strong:text-white
    prose-li:text-[var(--text-body)] prose-li:leading-relaxed
    prose-ul:my-4 prose-ol:my-4
    marker:text-[var(--accent)]
    prose-blockquote:border-l-2 prose-blockquote:border-l-[var(--accent)] prose-blockquote:text-[var(--text-muted)] prose-blockquote:not-italic
    prose-code:text-[var(--accent)] prose-code:bg-[var(--surface-2)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
    prose-pre:bg-[var(--surface-2)] prose-pre:border prose-pre:border-[var(--border)]
    prose-img:rounded-2xl prose-img:border prose-img:border-[var(--border)]`;

function formatLongDate(value) {
    if (!value) return null;
    return new Date(value).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function Gallery({ images }) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    if (!images?.length) return null;

    const slides = images.map((img) => ({ src: img.image_url }));

    return (
        <section className="mt-16">
            <h2 className="font-display font-semibold text-white mb-5"
                style={{ fontSize: "clamp(18px,2.2vw,22px)" }}>
                Galeria
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, i) => (
                    <button
                        key={img.id}
                        onClick={() => { setIndex(i); setOpen(true); }}
                        className="aspect-square overflow-hidden rounded-lg cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        style={{ background: "var(--surface-2)" }}
                    >
                        <img
                            src={img.image_url}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </button>
                ))}
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={slides}
                on={{ view: ({ index: i }) => setIndex(i) }}
                styles={{ root: { "--yarl__color_backdrop": "rgba(0,0,0,0.92)" } }}
            />
        </section>
    );
}

export default function PageShow({ page }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || "DevHub";

    const metaTitle = page.meta_title || page.title;
    const updatedAt = formatLongDate(page.updated_at);

    return (
        <PublicLayout>
            <Head title={`${metaTitle} — ${siteName}`}>
                {page.meta_description && <meta name="description" content={page.meta_description} />}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={metaTitle} />
                {page.meta_description && <meta property="og:description" content={page.meta_description} />}
                <meta property="og:url" content={route("pages.show", page.slug)} />
                {page.main_image_url && <meta property="og:image" content={page.main_image_url} />}
            </Head>

            <PageHero py="py-14">
                <Breadcrumb items={[{ label: "Home", href: "/" }, { label: page.title }]} />

                {page.eyebrow && <span className="eyebrow">{page.eyebrow}</span>}

                <h1 className="font-display font-semibold text-white leading-tight tracking-tight mt-3 mb-4"
                    style={{ fontSize: "clamp(34px,5vw,56px)" }}>
                    {page.title}
                </h1>

                {page.subtitle && (
                    <p className="max-w-[60ch] mb-5" style={{ color: "var(--text-body)", fontSize: 16 }}>
                        {page.subtitle}
                    </p>
                )}

                {updatedAt && (
                    <span className="inline-flex items-center gap-2 font-mono text-xs px-3.5 py-2 rounded-full"
                        style={{ background: "var(--surface)", border: "1px solid var(--border-2)", color: "var(--text-muted)" }}>
                        <Calendar size={13} style={{ color: "var(--accent)" }} />
                        Última atualização: {updatedAt}
                    </span>
                )}
            </PageHero>

            <div style={{ background: "var(--base)" }}>
                <Reveal className="max-w-[820px] mx-auto px-4 sm:px-6 py-14 pb-20">
                    {page.main_image_url && (
                        <div className="mb-10 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                            <img src={page.main_image_url} alt={page.title} className="w-full object-cover" />
                        </div>
                    )}

                    {page.content && (
                        <div
                            className={PROSE}
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
                        />
                    )}

                    <Gallery images={page.gallery_images} />
                </Reveal>
            </div>
        </PublicLayout>
    );
}
