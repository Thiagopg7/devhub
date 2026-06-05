import { Link, usePage } from "@inertiajs/react";
import { Mail, MapPin } from "lucide-react";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import Logo from "./Logo";

function FooterLink({ href, openInNewTab, className, children }) {
    const isExternal = /^https?:\/\//.test(href);
    const extraProps = openInNewTab || isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};
    if (isExternal) return <a href={href} className={className} {...extraProps}>{children}</a>;
    return <Link href={href} className={className} {...extraProps}>{children}</Link>;
}

const GH_ICON = (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9 9 0 014.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 3.9-1.4 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2z"/>
    </svg>
);
const LI_ICON = (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M4.98 3.5A2.5 2.5 0 002.5 6a2.5 2.5 0 005 0 2.5 2.5 0 00-2.52-2.5zM3 8.98h4v12.02H3V8.98zM10 8.98h3.8v1.64h.06c.53-1 1.83-2.06 3.76-2.06 4 0 4.74 2.64 4.74 6.07v6.37h-4v-5.65c0-1.35-.02-3.08-1.88-3.08-1.88 0-2.17 1.47-2.17 2.99v5.74H10V8.98z"/>
    </svg>
);

export default function Footer() {
    const year = new Date().getFullYear();
    const { siteConfig = {}, menuItems = [], footerCategories = [] } = usePage().props;

    const siteName    = siteConfig.site_name    || "DevHub";
    const tagline     = siteConfig.site_tagline || "Blog e portfólio de desenvolvimento web. Conteúdo técnico para quem constrói o futuro, uma linha de código por vez.";
    const footerMsg   = siteConfig.footer_message || `© ${year} DevHub. Todos os direitos reservados.`;
    const github      = siteConfig.footer_github    || null;
    const linkedin    = siteConfig.footer_linkedin   || null;
    const youtube     = siteConfig.footer_youtube    || null;
    const instagram   = siteConfig.footer_instagram  || null;
    const email       = siteConfig.contact_email    || null;
    const address     = siteConfig.contact_address  || null;
    const addressLink = siteConfig.contact_address_link || null;

    const hasContact = email || address;

    const linkCls = "text-sm transition-colors hover:text-[var(--accent)]";

    return (
        <footer style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    <div className="space-y-4 lg:col-span-1">
                        <Logo name={siteName} />
                        <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>{tagline}</p>
                        <div className="flex items-center gap-4 pt-1">
                            {[
                                { href: github,    label: 'GitHub',    icon: GH_ICON              },
                                { href: linkedin,  label: 'LinkedIn',  icon: LI_ICON              },
                                { href: youtube,   label: 'YouTube',   icon: <FaYoutube size={20} /> },
                                { href: instagram, label: 'Instagram', icon: <FaInstagram size={19} /> },
                            ].map(({ href, label, icon }) => (
                                <a key={label} href={href || '#'}
                                    {...(href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    aria-label={label}
                                    className="hover:text-[var(--accent)] transition-colors"
                                    style={{ color: 'var(--text-muted)' }}>
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {menuItems.length > 0 && (
                        <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Navegação</h5>
                            <ul className="space-y-2">
                                {menuItems
                                    .flatMap((item) => [item, ...(item.children ?? [])])
                                    .map((link) => (
                                        <li key={link.id}>
                                            <FooterLink href={link.url} openInNewTab={link.open_in_new_tab}
                                                className={linkCls} style={{ color: 'var(--text-muted)' }}>
                                                {link.label}
                                            </FooterLink>
                                        </li>
                                    ))}
                                <li>
                                    <FooterLink href="/politica-de-privacidade" className={linkCls} style={{ color: 'var(--text-muted)' }}>
                                        Política de Privacidade
                                    </FooterLink>
                                </li>
                            </ul>
                        </div>
                    )}

                    {footerCategories.length > 0 && (
                        <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Trilhas</h5>
                            <ul className="space-y-2">
                                {footerCategories.map((cat) => (
                                    <li key={cat.slug}>
                                        <Link href={route('blog.category', cat.slug)} className={linkCls} style={{ color: 'var(--text-muted)' }}>
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {hasContact && (
                        <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Contato</h5>
                            <ul className="space-y-3">
                                {email && (
                                    <li className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                                        <Mail size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                                        <a href={`mailto:${email}`} className="hover:text-[var(--accent)] transition-colors">{email}</a>
                                    </li>
                                )}
                                {address && (
                                    <li className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                                        <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                                        {addressLink ? (
                                            <a href={addressLink} target="_blank" rel="noopener noreferrer"
                                                className="hover:text-[var(--accent)] transition-colors">{address}</a>
                                        ) : (
                                            <span>{address}</span>
                                        )}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{footerMsg}</p>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Feito com <b className="text-[var(--accent)]">Laravel</b> + <b className="text-[#61dafb]">React</b>
                    </span>
                </div>
            </div>
        </footer>
    );
}
