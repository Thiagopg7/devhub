import { useEffect, useState } from 'react';
import Header from '@/Components/Public/Header';
import Footer from '@/Components/Public/Footer';
import PrivacyBanner from '@/Components/Public/PrivacyBanner';

function BackToTop() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 600);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Voltar ao topo"
            className={`totop${show ? ' show' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
        </button>
    );
}

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col font-sans antialiased" style={{ background: '#0a131e', color: '#eaf1fa' }}>
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <PrivacyBanner />
            <BackToTop />
        </div>
    );
}
