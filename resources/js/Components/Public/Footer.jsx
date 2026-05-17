import { Link } from '@inertiajs/react';
import { Mail, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import Logo from './Logo';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Marca */}
                    <div className="space-y-4">
                        <Logo />
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Conectando ideias, pessoas e tecnologias para acelerar a inovação.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a href="#" aria-label="Facebook" className="text-slate-500 hover:text-sky-400 transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" aria-label="Instagram" className="text-slate-500 hover:text-sky-400 transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" aria-label="YouTube" className="text-slate-500 hover:text-sky-400 transition-colors">
                                <FaYoutube size={20} />
                            </a>
                        </div>
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
                    <div>
                        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">
                            Contato
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-slate-400 text-sm">
                                <Mail size={16} className="mt-0.5 shrink-0 text-sky-400" />
                                <span>contato@devhub.com.br</span>
                            </li>
                            <li className="flex items-start gap-2 text-slate-400 text-sm">
                                <MapPin size={16} className="mt-0.5 shrink-0 text-sky-400" />
                                <span>São Paulo, SP — Brasil</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-6 text-center">
                    <p className="text-slate-500 text-xs">
                        © {year} DevHub. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
