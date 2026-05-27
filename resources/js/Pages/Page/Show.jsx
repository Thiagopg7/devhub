import { useState, useEffect, useCallback } from "react";
import { Head, usePage } from "@inertiajs/react";
import DOMPurify from "dompurify";
import PublicLayout from "@/Layouts/PublicLayout";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function DefaultBanner() {
    return (
        <div className="relative overflow-hidden bg-slate-900 h-56 md:h-72">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950" />
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `radial-gradient(circle, #38BDF8 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-sky-400/8 rounded-full blur-3xl" />
        </div>
    );
}

function Gallery({ images }) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    if (!images?.length) return null;

    const slides = images.map((img) => ({ src: img.image_url }));

    return (
        <section className="mt-16">
            <h2 className="text-xl font-bold text-white mb-5">Galeria</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, i) => (
                    <button
                        key={img.id}
                        onClick={() => { setIndex(i); setOpen(true); }}
                        className="aspect-square overflow-hidden rounded-lg bg-slate-800 cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    >
                        <img
                            src={img.image_url}
                            alt=""
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

    const ogImage = page.banner_image_url || page.main_image_url;

    return (
        <PublicLayout>
            <Head title={`${metaTitle} — ${siteName}`}>
                {page.meta_description && <meta name="description" content={page.meta_description} />}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={metaTitle} />
                {page.meta_description && <meta property="og:description" content={page.meta_description} />}
                <meta property="og:url" content={route('pages.show', page.slug)} />
                {ogImage && <meta property="og:image" content={ogImage} />}
            </Head>

            {/* Banner */}
            {page.banner_image_url ? (
                <div className="w-full h-56 md:h-72 overflow-hidden bg-slate-800">
                    <img
                        src={page.banner_image_url}
                        alt={page.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <DefaultBanner />
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {page.title}
                </h1>

                {page.subtitle && (
                    <p className="mt-3 text-slate-400 text-lg leading-relaxed border-l-2 border-sky-400 pl-4">
                        {page.subtitle}
                    </p>
                )}

                {/* Main image */}
                {page.main_image_url && (
                    <div className="mt-8 rounded-xl overflow-hidden border border-slate-700">
                        <img
                            src={page.main_image_url}
                            alt={page.title}
                            className="w-full object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                {page.content && (
                    <div
                        className="mt-10 prose prose-invert prose-sky max-w-none
                            prose-headings:text-slate-100
                            prose-p:text-slate-300 prose-p:leading-relaxed
                            prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-slate-100
                            prose-code:text-sky-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
                            prose-blockquote:border-l-sky-400 prose-blockquote:text-slate-400
                            prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
                    />
                )}

                {/* Gallery */}
                <Gallery images={page.gallery_images} />
            </div>
        </PublicLayout>
    );
}
