import { useEffect, useState } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'light';
        return (
            localStorage.getItem('admin-theme') ??
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        );
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('admin-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

    return { theme, toggleTheme };
}
