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
                className="text-sm font-medium text-[#b6c5d8] hover:text-white hover:bg-white/5 px-3 py-2 rounded-full transition-colors"
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
            <button className="flex items-center gap-1 text-sm font-medium text-[#b6c5d8] hover:text-white px-3 py-2 rounded-full transition-colors hover:bg-white/5">
                {item.label}
                <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 w-48 pt-1 z-50">
                    <div className="bg-hub-surface border border-[rgba(150,178,208,0.18)] rounded-xl shadow-xl py-1">
                        {item.children.map((child) => (
                            <MenuLink
                                key={child.id}
                                href={child.url}
                                openInNewTab={child.open_in_new_tab}
                                className="block px-4 py-2 text-sm text-[#b6c5d8] hover:text-[#3cbdf8] hover:bg-white/5 transition-colors"
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
                    ? 'bg-[rgba(10,19,30,0.9)] border-b border-[rgba(150,178,208,0.12)]'
                    : 'bg-[rgba(10,19,30,0.72)] border-b border-transparent'
            }`}
            style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[72px]">
                    <Link href="/">
                        <Logo name={siteName} />
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {menuItems.map((item) => (
                            <DesktopNavItem key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 px-[18px] py-[11px] rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)', color: '#03121d', boxShadow: '0 12px 30px -12px rgba(60,189,248,0.4)' }}
                        >
                            Explorar Posts
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-[rgba(150,178,208,0.24)] text-[#b6c5d8] hover:text-white transition-colors"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile nav */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 space-y-1 border-t border-[rgba(150,178,208,0.12)] pt-4">
                        {menuItems.map((item) => (
                            <div key={item.id}>
                                <MenuLink
                                    href={item.url}
                                    openInNewTab={item.open_in_new_tab}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-3 py-2 text-[#b6c5d8] hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/5"
                                >
                                    {item.label}
                                </MenuLink>
                                {item.children?.map((child) => (
                                    <MenuLink
                                        key={child.id}
                                        href={child.url}
                                        openInNewTab={child.open_in_new_tab}
                                        onClick={() => setMobileOpen(false)}
                                        className="block pl-7 pr-3 py-2 text-[#7b8da3] hover:text-[#3cbdf8] text-sm transition-colors"
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
                                style={{ background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)', color: '#03121d' }}
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
