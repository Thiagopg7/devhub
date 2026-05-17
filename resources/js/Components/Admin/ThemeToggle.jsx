import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
    return (
        <button
            onClick={onToggle}
            aria-label="Alternar tema"
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
