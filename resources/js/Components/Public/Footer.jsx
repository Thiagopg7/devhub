import { Link, usePage } from '@inertiajs/react';
import { Mail, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import Logo from './Logo';

export default function Footer() {
    const year = new Date().getFullYear();
    const { siteConfig = {} } = usePage().props;

    const siteName    = siteConfig.site_name          || 'DevHub';
    const tagline     = siteConfig.site_tagline       || 'Conectando ideias, pessoas e tecnologias para acelerar a inovação.';
    const footerMsg   = siteConfig.footer_message     || `© ${year} DevHub. Todos os direitos reservados.`;
    const facebook    = siteConfig.footer_facebook    || null;
    const instagram   = siteConfig.footer_instagram   || null;
    const youtube     = siteConfig.footer_youtube     || null;
    const email       = siteConfig.contact_email      || null;
    const address     = siteConfig.contact_address    || null;
    const addressLink = siteConfig.contact_address_link || null;

    const hasSocial  = facebook || instagram || youtube;
    const hasContact = email || address;

    return (
        <footer className="bg-slate-950 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Marca */}
                    <div className="space-y-4">
                        <Logo name={siteName} />
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            {tagline}
                        </p>
                        {hasSocial && (
                            <div className="flex items-center gap-4 pt-2">
                                {facebook && (
                                    <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-slate-500 hover:text-sky-400 transition-colors">
                                        <FaFacebook size={20} />
                                    </a>
                                )}
                                {instagram && (
                                    <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-500 hover:text-sky-400 transition-colors">
                                        <FaInstagram size={20} />
                                    </a>
                                )}
                                {youtube && (
                                    <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-slate-500 hover:text-sky-400 transition-colors">
                                        <FaYoutube size={20} />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navegação */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">
                            Navegação
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { label: 'Início', href: '/' },
                                { label: 'Blog', href: '/blog' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-sky-400 text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contato */}
                    {hasContact && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">
                                Contato
                            </h3>
                            <ul className="space-y-3">
                                {email && (
                                    <li className="flex items-start gap-2 text-slate-400 text-sm">
                                        <Mail size={16} className="mt-0.5 shrink-0 text-sky-400" />
                                        <a href={`mailto:${email}`} className="hover:text-sky-400 transition-colors">
                                            {email}
                                        </a>
                                    </li>
                                )}
                                {address && (
                                    <li className="flex items-start gap-2 text-slate-400 text-sm">
                                        <MapPin size={16} className="mt-0.5 shrink-0 text-sky-400" />
                                        {addressLink ? (
                                            <a href={addressLink} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                                                {address}
                                            </a>
                                        ) : (
                                            <span>{address}</span>
                                        )}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-800 mt-12 pt-6 text-center">
                    <p className="text-slate-500 text-xs">{footerMsg}</p>
                </div>
            </div>
        </footer>
    );
}
