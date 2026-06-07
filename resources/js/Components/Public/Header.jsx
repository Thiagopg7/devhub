import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { sanitizeHref } from '@/lib/utils';

function MenuLink({ href, openInNewTab, className, onClick, children }) {
    const safeHref = sanitizeHref(href);
    const isExternal = /^https?:\/\//.test(safeHref);
    const extraProps = openInNewTab || isExternal
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {};
    if (isExternal) {
        return <a href={safeHref} className={className} onClick={onClick} {...extraProps}>{children}</a>;
    }
    return <Link href={safeHref} className={className} onClick={onClick} {...extraProps}>{children}</Link>;
}

function DesktopNavItem({ item }) {
    const [open, setOpen] = useState(false);
    const hasChildren = item.children?.length > 0;

    if (!hasChildren) {
        return (
            <MenuLink
                href={item.url}
                openInNewTab={item.open_in_new_tab}
                className="text-sm font-medium text-[var(--text-body)] hover:text-white hover:bg-white/5 px-3 py-2 rounded-full transition-colors"
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
            <button className="flex items-center gap-1 text-sm font-medium text-[var(--text-body)] hover:text-white px-3 py-2 rounded-full transition-colors hover:bg-white/5">
                {item.label}
                <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 w-48 pt-1 z-50">
                    <div className="bg-hub-surface border border-[var(--border-2)] rounded-xl shadow-xl py-1">
                        {item.children.map((child) => (
                            <MenuLink
                                key={child.id}
                                href={child.url}
                                openInNewTab={child.open_in_new_tab}
                                className="block px-4 py-2 text-sm text-[var(--text-body)] hover:text-[var(--accent)] hover:bg-white/5 transition-colors"
                            >
                                {child.label}
                            </MenuLink>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Header() {
    const { siteConfig = {}, menuItems = [] } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const siteName = siteConfig.site_name || 'DevHub';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Drawer mobile: trava o scroll do body e fecha no Escape.
    useEffect(() => {
        if (!mobileOpen) return;
        const onKey = (e) => e.key === 'Escape' && setMobileOpen(false);
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <>
        <header
            className={`sticky top-0 z-50 transition-colors duration-300 ${
                scrolled
                    ? 'bg-[rgba(10,19,30,0.9)] border-b border-[var(--border)]'
                    : 'bg-[rgba(10,19,30,0.72)] border-b border-transparent'
            }`}
            style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[72px]">
                    <Link href="/">
                        <Logo name={siteName} />
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {menuItems.map((item) => (
                            <DesktopNavItem key={item.id} item={item} />
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 px-[18px] py-[11px] rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(180deg,var(--accent),var(--accent-2))', color: 'var(--accent-ink)', boxShadow: '0 12px 30px -12px rgba(60,189,248,0.4)' }}
                        >
                            Explorar Posts
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <button
                        onClick={() => setMobileOpen(true)}
                        aria-label="Abrir menu"
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border-s)] text-[var(--text-body)] hover:text-white transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </nav>
        </header>

            {/* Backdrop do drawer mobile */}
            <div
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
                className={`md:hidden fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Drawer lateral mobile */}
            <aside
                aria-hidden={!mobileOpen}
                className={`md:hidden fixed top-0 right-0 z-[70] h-screen w-[82%] max-w-xs flex flex-col transform transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ background: 'var(--panel)', borderLeft: '1px solid var(--border)' }}
            >
                <div className="flex items-center justify-between h-[72px] px-5 border-b border-[var(--border)] shrink-0">
                    <Logo name={siteName} />
                    <button
                        onClick={() => setMobileOpen(false)}
                        aria-label="Fechar menu"
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border-s)] text-[var(--text-body)] hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            <MenuLink
                                href={item.url}
                                openInNewTab={item.open_in_new_tab}
                                onClick={() => setMobileOpen(false)}
                                className="block px-3 py-2.5 text-[var(--text-body)] hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/5"
                            >
                                {item.label}
                            </MenuLink>
                            {item.children?.map((child) => (
                                <MenuLink
                                    key={child.id}
                                    href={child.url}
                                    openInNewTab={child.open_in_new_tab}
                                    onClick={() => setMobileOpen(false)}
                                    className="block pl-7 pr-3 py-2 text-[var(--text-muted)] hover:text-[var(--accent)] text-sm transition-colors"
                                >
                                    {child.label}
                                </MenuLink>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-[var(--border)] shrink-0">
                    <Link
                        href="/blog"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm w-full"
                        style={{ background: 'linear-gradient(180deg,var(--accent),var(--accent-2))', color: 'var(--accent-ink)' }}
                    >
                        Explorar Posts <ArrowRight size={14} />
                    </Link>
                </div>
            </aside>
        </>
    );
}
