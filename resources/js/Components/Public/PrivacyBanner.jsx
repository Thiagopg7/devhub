import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Cookie, X, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "cookie_consent";

export function useCookieConsent() {
    return typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null;
}

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            // Small delay so the banner doesn't flash on load
            const t = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(t);
        }
    }, []);

    const dismiss = (choice) => {
        setLeaving(true);
        setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, choice);
            setVisible(false);
            setLeaving(false);

            // Dispatch event so other parts of the app can react
            window.dispatchEvent(new CustomEvent("cookieConsentChange", { detail: choice }));
        }, 350);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Consentimento de cookies"
            className={`fixed bottom-0 inset-x-0 z-50 px-4 pb-4 sm:px-6 transition-all duration-350 ${
                leaving ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
            }`}
        >
            <div className="max-w-4xl mx-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="shrink-0 mt-0.5 p-2 rounded-lg bg-sky-400/10 text-sky-400">
                        <Cookie size={20} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-100 mb-1">
                            Sua privacidade importa
                        </p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Usamos cookies essenciais para o funcionamento do site e, com sua
                            permissão, cookies analíticos para entender como as pessoas navegam
                            por aqui.{" "}
                            <Link
                                href="/politica-de-privacidade"
                                className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
                            >
                                Política de Privacidade
                            </Link>
                            .
                        </p>
                    </div>

                    {/* Close (equivalent to essential only) */}
                    <button
                        onClick={() => dismiss("essential")}
                        className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
                    <button
                        onClick={() => dismiss("essential")}
                        className="px-4 py-2 text-sm font-medium text-slate-300 border border-slate-600 rounded-lg hover:border-slate-500 hover:text-white transition-colors"
                    >
                        Apenas essenciais
                    </button>
                    <button
                        onClick={() => dismiss("all")}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-sky-400 text-slate-900 rounded-lg hover:bg-sky-300 transition-colors"
                    >
                        <ShieldCheck size={15} />
                        Aceitar todos
                    </button>
                </div>
            </div>
        </div>
    );
}
