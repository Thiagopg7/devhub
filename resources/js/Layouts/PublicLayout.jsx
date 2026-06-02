import Header from '@/Components/Public/Header';
import Footer from '@/Components/Public/Footer';
import PrivacyBanner from '@/Components/Public/PrivacyBanner';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col font-sans antialiased" style={{ background: '#0a131e', color: '#eaf1fa' }}>
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <PrivacyBanner />
        </div>
    );
}
