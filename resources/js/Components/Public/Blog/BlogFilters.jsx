import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, X, LayoutGrid } from 'lucide-react';
import Pill from '@/Components/Public/ui/Pill';
import { categoryIcon } from '@/lib/utils';

const PILL_SIZE = 'px-4 py-2 text-sm !rounded-xl';

export default function BlogFilters({ filters = {}, categories = [], totalPosts = 0 }) {
    const categoriaAtiva = filters.categoria || null;
    const [busca, setBusca] = useState(filters.busca || '');

    const navigate = (params) => {
        const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
        router.get(route('blog.index'), clean, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate({ busca: busca.trim(), categoria: categoriaAtiva });
    };

    const limparBusca = () => {
        setBusca('');
        navigate({ categoria: categoriaAtiva });
    };

    const selecionarCategoria = (slug) => {
        navigate({ busca: busca.trim(), categoria: slug });
    };

    const activeCount = categoriaAtiva
        ? (categories.find(c => c.slug === categoriaAtiva)?.posts_count ?? 0)
        : totalPosts;

    return (
        <>
            <div className="flex items-center gap-3 mb-4">
                <form onSubmit={handleSearch} className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                    <input
                        type="search"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar artigos…"
                        className="w-full pl-9 pr-4 py-3 rounded-xl text-sm placeholder-[var(--text-muted)] focus:outline-none transition-colors"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', color: 'var(--text-bright)' }}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-2)'}
                    />
                </form>
                {filters.busca && (
                    <button type="button" onClick={limparBusca}
                        className="px-3 py-3 rounded-xl transition-colors hover:text-white shrink-0"
                        style={{ border: '1px solid var(--border-2)', color: 'var(--text-muted)' }}
                        title="Limpar busca">
                        <X size={16} />
                    </button>
                )}
                <span className="font-mono text-sm shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {activeCount} artigos
                </span>
            </div>

            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <Pill active={!categoriaAtiva} size={PILL_SIZE} onClick={() => selecionarCategoria(null)}>
                        <LayoutGrid size={14} />
                        Todos
                        <span className="font-mono text-xs opacity-75">{totalPosts}</span>
                    </Pill>

                    {categories.map((cat) => {
                        const Icon = categoryIcon(cat.slug);
                        return (
                            <Pill key={cat.id} active={categoriaAtiva === cat.slug} size={PILL_SIZE}
                                onClick={() => selecionarCategoria(cat.slug)}>
                                <Icon size={14} />
                                {cat.name}
                                <span className="font-mono text-xs opacity-75">{cat.posts_count}</span>
                            </Pill>
                        );
                    })}
                </div>
            )}
        </>
    );
}
