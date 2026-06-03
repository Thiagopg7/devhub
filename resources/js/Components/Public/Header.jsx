import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
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

    return (
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
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border-s)] text-[var(--text-body)] hover:text-white transition-colors"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {mobileOpen && (
                    <div className="md:hidden pb-4 space-y-1 border-t border-[var(--border)] pt-4">
                        {menuItems.map((item) => (
                            <div key={item.id}>
                                <MenuLink
                                    href={item.url}
                                    openInNewTab={item.open_in_new_tab}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-3 py-2 text-[var(--text-body)] hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/5"
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
                        <div className="pt-2">
                            <Link
                                href="/blog"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm w-full justify-center"
                                style={{ background: 'linear-gradient(180deg,var(--accent),var(--accent-2))', color: 'var(--accent-ink)' }}
                            >
                                Explorar Posts <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
