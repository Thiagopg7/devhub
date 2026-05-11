import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar } from 'lucide-react';

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function PostCard({ post }) {
    return (
        <article className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-sky-400/50 transition-all duration-300 hover:-translate-y-1 flex flex-col">
            {/* Banner */}
            <div className="aspect-video overflow-hidden bg-slate-700">
                {post.banner_image ? (
                    <img
                        src={post.banner_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sky-900/40 to-slate-800 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-sky-400/20 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-sky-400/40" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
                    <Calendar size={12} />
                    <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                </div>

                <h3 className="text-slate-100 font-semibold text-base leading-snug mb-2 line-clamp-2 group-hover:text-sky-400 transition-colors">
                    {post.title}
                </h3>

                {post.description && (
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                        {post.description}
                    </p>
                )}

                <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sky-400 text-sm font-medium hover:gap-2.5 transition-all mt-auto"
                >
                    Ler artigo
                    <ArrowRight size={14} />
                </Link>
            </div>
        </article>
    );
}
