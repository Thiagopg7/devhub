import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Home, ArrowLeft, BookOpen } from 'lucide-react';

const messages = {
    404: {
        code:        '404',
        title:       'Página não encontrada',
        description: 'A página que você está procurando não existe ou foi movida para outro endereço.',
    },
    403: {
        code:        '403',
        title:       'Acesso negado',
        description: 'Você não tem permissão para acessar este conteúdo.',
    },
    500: {
        code:        '500',
        title:       'Erro interno',
        description: 'Algo deu errado no servidor. Já estamos trabalhando para resolver.',
    },
    503: {
        code:        '503',
        title:       'Fora do ar',
        description: 'O serviço está temporariamente indisponível. Volte em alguns instantes.',
    },
};

export default function Error({ status = 404 }) {
    const { code, title, description } = messages[status] ?? messages[404];

    return (
        <PublicLayout>
            <Head title={`${code} — ${title}`} />

            <section className="relative overflow-hidden bg-slate-900 flex-1 flex items-center">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950" />

                {/* Dot pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle, #38BDF8 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Glow blobs */}
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-sky-400/8 rounded-full blur-3xl pointer-events-none" />

                <div className="relative w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">

                    {/* Big code number */}
                    <div
                        className="text-[9rem] sm:text-[12rem] font-black leading-none tracking-tighter select-none"
                        style={{
                            background: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 50%, #7DD3FC 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 40px rgba(56,189,248,0.25))',
                        }}
                    >
                        {code}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                        {title}
                    </h1>

                    <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-10">
                        {description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-400 text-slate-900 font-semibold rounded-lg hover:bg-sky-300 transition-colors"
                        >
                            <Home size={16} />
                            Ir para o início
                        </Link>
                        <Link
                            href="/blog"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-sky-400 hover:text-sky-400 transition-colors"
                        >
                            <BookOpen size={16} />
                            Ver o blog
                        </Link>
                    </div>

                </div>
            </section>
        </PublicLayout>
    );
}
