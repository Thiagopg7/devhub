import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { usePage } from '@inertiajs/react';

export default function Newsletter() {
    const { newsletterAreas = [] } = usePage().props;
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', area: '' });

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
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
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                            />
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
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Área de atuação
                            </label>
                            <select
                                name="area"
                                required
                                value={form.area}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-400 transition-colors"
                            >
                                <option value="" disabled>Selecione sua área</option>
                                {newsletterAreas.map((area) => (
                                    <option key={area.id} value={area.name}>{area.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2 flex justify-center pt-2">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-sky-400 text-slate-900 font-semibold rounded-lg hover:bg-sky-300 transition-colors"
                            >
                                <Send size={16} />
                                Inscrever-se
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
