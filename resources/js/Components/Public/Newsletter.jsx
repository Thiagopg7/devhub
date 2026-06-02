import { useState } from 'react';
import { Send, CheckCircle, Loader, Check } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

export default function Newsletter() {
    const { newsletterAreas = [] } = usePage().props;
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ name: '', email: '', newsletter_area_id: '', lgpd_consent: false, website: '' });

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await axios.post('/newsletter/subscribe', {
                name: form.name, email: form.email,
                newsletter_area_id: form.newsletter_area_id,
                lgpd_consent: form.lgpd_consent,
                website: form.website,
            });
            setSubmitted(true);
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            } else if (err.response?.status === 429) {
                setErrors({ email: ['Muitas tentativas. Aguarde alguns minutos e tente novamente.'] });
            } else {
                setErrors({ email: ['Erro ao realizar inscrição. Tente novamente.'] });
            }
        } finally {
            setLoading(false);
        }
    }

    const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm placeholder-[#7b8da3] focus:outline-none transition-colors disabled:opacity-50";
    const inputStyle = { background: '#0a131e', border: '1px solid rgba(150,178,208,0.18)', color: '#eaf1fa' };

    return (
        <section id="newsletter" className="relative" style={{ background: '#0a131e', borderTop: '1px solid rgba(150,178,208,0.12)', borderBottom: '1px solid rgba(150,178,208,0.12)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="relative rounded-[22px] overflow-hidden p-8 md:p-12"
                    style={{ background: 'linear-gradient(135deg,rgba(21,36,58,0.9),rgba(16,31,48,0.9))', border: '1px solid rgba(150,178,208,0.18)', boxShadow: '0 40px 80px -30px rgba(0,0,0,0.5)' }}>

                    {/* Glow */}
                    <div className="absolute pointer-events-none" style={{ width: 600, height: 600, top: -200, right: -100, background: 'radial-gradient(circle,rgba(60,189,248,0.1) 0%,transparent 60%)' }} />

                    <div className="relative grid md:grid-cols-2 gap-10 items-start">

                        {/* Copy */}
                        <div>
                            <span className="eyebrow">Newsletter</span>
                            <h2 className="font-display font-semibold text-white mt-4 leading-tight tracking-tight" style={{ fontSize: 'clamp(28px,3.2vw,38px)' }}>
                                Fique por dentro<br />das novidades
                            </h2>
                            <p className="mt-4 text-[16px]" style={{ color: '#b6c5d8' }}>
                                Receba os melhores artigos sobre tecnologia e inovação diretamente no seu e-mail. Sem spam, só o que importa.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {['Curadoria semanal de conteúdo técnico', 'Tutoriais e guias antes de todo mundo', 'Cancele quando quiser, em um clique'].map((perk) => (
                                    <li key={perk} className="flex items-center gap-3 text-sm" style={{ color: '#b6c5d8' }}>
                                        <Check size={16} style={{ color: '#3cbdf8', flexShrink: 0 }} />
                                        {perk}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Form */}
                        <div>
                            {submitted ? (
                                <div className="flex flex-col items-center gap-3 py-8 text-center">
                                    <CheckCircle size={48} style={{ color: '#3cbdf8' }} />
                                    <p className="text-lg font-semibold text-white">Inscrição confirmada!</p>
                                    <p className="text-sm" style={{ color: '#7b8da3' }}>Em breve você receberá nossas novidades.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Honeypot */}
                                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                                        <input type="text" name="website" value={form.website} onChange={handleChange} tabIndex="-1" autoComplete="off" />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#7b8da3' }}>Nome</label>
                                            <input type="text" name="name" required value={form.name} onChange={handleChange}
                                                placeholder="Seu nome" disabled={loading}
                                                className={inputCls} style={inputStyle}
                                                onFocus={e => e.target.style.borderColor='#3cbdf8'}
                                                onBlur={e => e.target.style.borderColor='rgba(150,178,208,0.18)'} />
                                            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name[0]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#7b8da3' }}>E-mail</label>
                                            <input type="email" name="email" required value={form.email} onChange={handleChange}
                                                placeholder="seu@email.com" disabled={loading}
                                                className={inputCls} style={inputStyle}
                                                onFocus={e => e.target.style.borderColor='#3cbdf8'}
                                                onBlur={e => e.target.style.borderColor='rgba(150,178,208,0.18)'} />
                                            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email[0]}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#7b8da3' }}>Área de atuação</label>
                                        <select name="newsletter_area_id" required value={form.newsletter_area_id} onChange={handleChange}
                                            disabled={loading} className={inputCls} style={inputStyle}
                                            onFocus={e => e.target.style.borderColor='#3cbdf8'}
                                            onBlur={e => e.target.style.borderColor='rgba(150,178,208,0.18)'}>
                                            <option value="" disabled>Selecione sua área</option>
                                            {newsletterAreas.map((area) => (
                                                <option key={area.id} value={area.id}>{area.name}</option>
                                            ))}
                                        </select>
                                        {errors.newsletter_area_id && <p className="mt-1 text-xs text-red-400">{errors.newsletter_area_id[0]}</p>}
                                    </div>

                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" name="lgpd_consent" checked={form.lgpd_consent} onChange={handleChange}
                                            disabled={loading}
                                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-500 bg-[#0a131e] text-[#3cbdf8] focus:ring-[#3cbdf8] focus:ring-offset-0 disabled:opacity-50" />
                                        <span className="text-xs leading-relaxed" style={{ color: '#7b8da3' }}>
                                            Concordo em receber comunicações por e-mail. Posso me descadastrar a qualquer momento pelo link em cada e-mail.
                                        </span>
                                    </label>
                                    {errors.lgpd_consent && <p className="text-xs text-red-400">{errors.lgpd_consent[0]}</p>}

                                    <button type="submit" disabled={loading}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[15px] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                        style={{ background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)', color: '#03121d', boxShadow: '0 12px 30px -12px rgba(60,189,248,0.4)' }}>
                                        {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                                        {loading ? 'Enviando...' : 'Inscrever-se'}
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
