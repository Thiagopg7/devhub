import { Search } from 'lucide-react';

export default function AdminSearchForm({ value, onChange, onSubmit, placeholder = 'Pesquisar...', children }) {
    return (
        <form onSubmit={onSubmit} className="mb-6 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-52">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    id="q"
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition"
                />
            </div>
            {children}
            <button
                type="submit"
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors whitespace-nowrap"
            >
                Filtrar
            </button>
        </form>
    );
}
