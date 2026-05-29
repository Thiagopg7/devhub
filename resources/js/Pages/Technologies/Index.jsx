import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Newsletter from '@/Components/Public/Newsletter';
import { ExternalLink } from 'lucide-react';

function TechCard({ tech }) {
    return (
        <a
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-sky-400/50 transition-all duration-300 hover:-translate-y-1"
        >
            <div className="aspect-video overflow-hidden bg-slate-700 shrink-0">
                {tech.screenshot_image_url ? (
                    <img
                        src={tech.screenshot_image_url}
                        alt={tech.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sky-900/40 to-slate-800 flex items-center justify-center">
                        {tech.icon_image_url ? (
                            <img src={tech.icon_image_url} alt={tech.name} loading="lazy" className="w-16 h-16 object-contain opacity-30" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-sky-400/20 flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-sky-400/40" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                    {tech.icon_image_url ? (
                        <img
                            src={tech.icon_image_url}
                            alt={tech.name}
                            loading="lazy"
                            className="w-9 h-9 rounded-lg object-contain bg-white/10 p-1 shrink-0"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-lg bg-sky-400/20 shrink-0" />
                    )}
                    <h2 className="text-white font-bold text-lg leading-tight group-hover:text-sky-400 transition-colors">
                        {tech.name}
                    </h2>
                </div>

                {tech.description && (
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1">
                        {tech.description}
                    </p>
                )}

                <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-sky-400 text-sm font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        Acessar
                        <ExternalLink size={13} />
                    </span>
                </div>
            </div>
        </a>
    );
}

export default function TechnologiesIndex({ technologies = [] }) {
    const { siteConfig = {} } = usePage().props;
    const siteName = siteConfig.site_name || 'DevHub';

    return (
        <PublicLayout>
            <Head title={`Tecnologias — ${siteName}`}>
                <meta name="description" content="Ferramentas e tecnologias em destaque" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={`Tecnologias — ${siteName}`} />
                <meta property="og:description" content="Ferramentas e tecnologias em destaque" />
                <meta property="og:url" content={route('technologies.index')} />
            </Head>

            <div className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <h1 className="text-3xl font-bold text-white mb-2">Ferramentas &amp; Tecnologias</h1>
                    <p className="text-slate-400">Tecnologias em destaque no mercado</p>
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                {technologies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {technologies.map((tech) => (
                            <TechCard key={tech.id} tech={tech} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 text-slate-500">
                        <p className="text-lg">Nenhuma tecnologia cadastrada ainda.</p>
                    </div>
                )}
            </section>

            <Newsletter />
        </PublicLayout>
    );
}
