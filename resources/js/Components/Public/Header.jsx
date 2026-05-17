import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from './Logo';

function MenuLink({ href, openInNewTab, className, onClick, children }) {
    const isExternal = /^https?:\/\//.test(href);
    const extraProps = openInNewTab || isExternal
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {};
    if (isExternal) {
        return <a href={href} className={className} onClick={onClick} {...extraProps}>{children}</a>;
    }
    return <Link href={href} className={className} onClick={onClick} {...extraProps}>{children}</Link>;
}

function DesktopNavItem({ item }) {
    const [open, setOpen] = useState(false);
    const hasChildren = item.children?.length > 0;

    if (!hasChildren) {
        return (
            <MenuLink
                href={item.url}
                openInNewTab={item.open_in_new_tab}
                className="text-slate-300 hover:text-sky-400 text-sm font-medium transition-colors"
            >
                {item.label}
            </MenuLink>
        );
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button className="flex items-center gap-1 text-slate-300 hover:text-sky-400 text-sm font-medium transition-colors">
                {item.label}
                <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                    {item.children.map((child) => (
                        <MenuLink
                            key={child.id}
                            href={child.url}
                            openInNewTab={child.open_in_new_tab}
                            className="block px-4 py-2 text-sm text-slate-300 hover:text-sky-400 hover:bg-slate-700 transition-colors"
                        >
                            {child.label}
                        </MenuLink>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Header() {
    const { auth, siteConfig = {}, menuItems = [] } = usePage().props;
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
                        {menuItems.map((item) => (
                            <DesktopNavItem key={item.id} item={item} />
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
                    <div className="md:hidden pb-4 space-y-1 border-t border-slate-800 pt-4">
                        {menuItems.map((item) => (
                            <div key={item.id}>
                                <MenuLink
                                    href={item.url}
                                    openInNewTab={item.open_in_new_tab}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-2 py-2 text-slate-300 hover:text-sky-400 text-sm font-medium transition-colors"
                                >
                                    {item.label}
                                </MenuLink>
                                {item.children?.map((child) => (
                                    <MenuLink
                                        key={child.id}
                                        href={child.url}
                                        openInNewTab={child.open_in_new_tab}
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-6 py-2 text-slate-400 hover:text-sky-400 text-sm transition-colors"
                                    >
                                        {child.label}
                                    </MenuLink>
                                ))}
                            </div>
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
