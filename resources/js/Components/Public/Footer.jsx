import { Link, usePage } from "@inertiajs/react";
import { Mail, MapPin } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
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

const TRACKS = ['Backend', 'Frontend', 'IA & Dados', 'Banco de Dados', 'Carreira'];

export default function Footer() {
    const year = new Date().getFullYear();
    const { siteConfig = {}, menuItems = [] } = usePage().props;

    const siteName    = siteConfig.site_name    || "DevHub";
    const tagline     = siteConfig.site_tagline || "Blog e portfólio de desenvolvimento web. Conteúdo técnico para quem constrói o futuro, uma linha de código por vez.";
    const footerMsg   = siteConfig.footer_message || `© ${year} DevHub. Todos os direitos reservados.`;
    const github      = siteConfig.footer_github    || null;
    const linkedin    = siteConfig.footer_linkedin   || null;
    const youtube     = siteConfig.footer_youtube    || null;
    const email       = siteConfig.contact_email    || null;
    const address     = siteConfig.contact_address  || null;
    const addressLink = siteConfig.contact_address_link || null;

    const hasSocial  = github || linkedin || youtube;
    const hasContact = email || address;

    const linkCls = "text-sm transition-colors hover:text-[#3cbdf8]";

    return (
        <footer style={{ background: '#0c1828', borderTop: '1px solid rgba(150,178,208,0.12)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Marca */}
                    <div className="space-y-4 lg:col-span-1">
                        <Logo name={siteName} />
                        <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#7b8da3' }}>{tagline}</p>
                        {hasSocial && (
                            <div className="flex items-center gap-4 pt-1">
                                {github && (
                                    <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                                        style={{ color: '#7b8da3' }} className="hover:text-[#3cbdf8] transition-colors">
                                        {GH_ICON}
                                    </a>
                                )}
                                {linkedin && (
                                    <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                                        style={{ color: '#7b8da3' }} className="hover:text-[#3cbdf8] transition-colors">
                                        {LI_ICON}
                                    </a>
                                )}
                                {youtube && (
                                    <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                                        style={{ color: '#7b8da3' }} className="hover:text-[#3cbdf8] transition-colors">
                                        <FaYoutube size={20} />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navegação */}
                    {menuItems.length > 0 && (
                        <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Navegação</h5>
                            <ul className="space-y-2">
                                {menuItems
                                    .flatMap((item) => [item, ...(item.children ?? [])])
                                    .map((link) => (
                                        <li key={link.id}>
                                            <FooterLink href={link.url} openInNewTab={link.open_in_new_tab}
                                                className={linkCls} style={{ color: '#7b8da3' }}>
                                                {link.label}
                                            </FooterLink>
                                        </li>
                                    ))}
                                <li>
                                    <Link href="/politica-privacidade" className={linkCls} style={{ color: '#7b8da3' }}
                                        target="_blank" rel="noopener noreferrer">
                                        Política de Privacidade
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Trilhas */}
                    <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Trilhas</h5>
                        <ul className="space-y-2">
                            {TRACKS.map((t) => (
                                <li key={t}>
                                    <Link href="/blog" className={linkCls} style={{ color: '#7b8da3' }}>{t}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contato */}
                    {hasContact && (
                        <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Contato</h5>
                            <ul className="space-y-3">
                                {email && (
                                    <li className="flex items-start gap-2 text-sm" style={{ color: '#7b8da3' }}>
                                        <Mail size={16} className="mt-0.5 shrink-0" style={{ color: '#3cbdf8' }} />
                                        <a href={`mailto:${email}`} className="hover:text-[#3cbdf8] transition-colors">{email}</a>
                                    </li>
                                )}
                                {address && (
                                    <li className="flex items-start gap-2 text-sm" style={{ color: '#7b8da3' }}>
                                        <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: '#3cbdf8' }} />
                                        {addressLink ? (
                                            <a href={addressLink} target="_blank" rel="noopener noreferrer"
                                                className="hover:text-[#3cbdf8] transition-colors">{address}</a>
                                        ) : (
                                            <span>{address}</span>
                                        )}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(150,178,208,0.12)' }}>
                    <p className="text-xs" style={{ color: '#7b8da3' }}>{footerMsg}</p>
                    <span className="text-xs" style={{ color: '#7b8da3' }}>
                        Feito com <b className="text-[#3cbdf8]">Laravel</b> + <b className="text-[#61dafb]">React</b>
                    </span>
                </div>
            </div>
        </footer>
    );
}
