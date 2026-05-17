import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const navLinks = [
    { label: 'Início', href: '/' },
    { label: 'Blog', href: '/blog' },
];

export default function Header() {
    const { auth, siteConfig = {} } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const siteName = siteConfig.site_name || 'DevHub';

    return (
        <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/">
                        <Logo name={siteName} />
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-slate-300 hover:text-sky-400 text-sm font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {auth?.user ? (
                            <Link
                                href="/admin"
                                className="px-4 py-2 text-sm font-semibold text-slate-900 bg-sky-400 rounded-lg hover:bg-sky-300 transition-colors"
                            >
                                Painel Admin
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm font-semibold text-sky-400 border border-sky-400 rounded-lg hover:bg-sky-400/10 transition-colors"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-slate-300 hover:text-white"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile nav */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 space-y-2 border-t border-slate-800 pt-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-2 py-2 text-slate-300 hover:text-sky-400 text-sm font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {auth?.user ? (
                            <Link
                                href="/admin"
                                className="block px-2 py-2 text-sm font-semibold text-sky-400"
                            >
                                Painel Admin
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="block px-2 py-2 text-sm font-semibold text-sky-400"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}
