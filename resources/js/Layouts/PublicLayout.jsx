import Header from '@/Components/Public/Header';
import Footer from '@/Components/Public/Footer';
import PrivacyBanner from '@/Components/Public/PrivacyBanner';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <PrivacyBanner />
        </div>
    );
}
