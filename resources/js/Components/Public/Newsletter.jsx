import { useState } from 'react';
import { Send, CheckCircle, Loader } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

export default function Newsletter() {
    const { newsletterAreas = [] } = usePage().props;
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ name: '', email: '', newsletter_area_id: '', website: '' });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await axios.post('/newsletter/subscribe', {
                name:               form.name,
                email:              form.email,
                newsletter_area_id: form.newsletter_area_id,
                website:            form.website, // honeypot — always empty for real users
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

    return (
        <section id="newsletter" className="bg-slate-800 border-y border-slate-700">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-3xl font-bold text-white mb-3">
                    Fique por dentro das novidades
                </h2>
                <p className="text-slate-400 mb-10">
                    Receba os melhores artigos sobre tecnologia e inovação diretamente no seu e-mail.
                </p>

                {submitted ? (
                    <div className="flex flex-col items-center gap-3 text-sky-400">
                        <CheckCircle size={48} />
                        <p className="text-lg font-semibold">Inscrição realizada!</p>
                        <p className="text-slate-400 text-sm">Em breve você receberá nossas novidades.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">

                        {/* Honeypot — hidden from real users, filled by bots */}
                        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                            <input
                                type="text"
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                tabIndex="-1"
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Nome
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Seu nome"
                                disabled={loading}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors disabled:opacity-50"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                E-mail
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="seu@email.com"
                                disabled={loading}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors disabled:opacity-50"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email[0]}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Área de atuação
                            </label>
                            <select
                                name="newsletter_area_id"
                                required
                                value={form.newsletter_area_id}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-400 transition-colors disabled:opacity-50"
                            >
                                <option value="" disabled>Selecione sua área</option>
                                {newsletterAreas.map((area) => (
                                    <option key={area.id} value={area.id}>{area.name}</option>
                                ))}
                            </select>
                            {errors.newsletter_area_id && <p className="mt-1 text-xs text-red-400">{errors.newsletter_area_id[0]}</p>}
                        </div>

                        <div className="sm:col-span-2 flex justify-center pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-sky-400 text-slate-900 font-semibold rounded-lg hover:bg-sky-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                                {loading ? 'Enviando...' : 'Inscrever-se'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
