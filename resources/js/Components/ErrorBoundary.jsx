import { Component } from 'react';
import { Home, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('[ErrorBoundary]', error, info);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div
                        className="text-[8rem] font-black leading-none tracking-tighter select-none mb-4"
                        style={{
                            background: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 50%, #7DD3FC 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Ops
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-3">
                        Algo deu errado
                    </h1>

                    <p className="text-slate-400 mb-8">
                        Ocorreu um erro inesperado na interface. Tente recarregar a página.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-400 text-slate-900 font-semibold rounded-lg hover:bg-sky-300 transition-colors"
                        >
                            <RefreshCw size={16} />
                            Recarregar
                        </button>
                        <a
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-sky-400 hover:text-sky-400 transition-colors"
                        >
                            <Home size={16} />
                            Ir para o início
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
