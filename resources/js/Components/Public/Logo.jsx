export default function Logo({ className = '' }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="50" y1="50" x2="80" y2="50" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="50" x2="65" y2="76" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="50" x2="35" y2="76" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="50" x2="20" y2="50" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="50" x2="35" y2="24" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="50" x2="65" y2="24" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="50" r="7" fill="#38BDF8" />
                <circle cx="80" cy="50" r="4" fill="#7DD3FC" />
                <circle cx="65" cy="76" r="4" fill="#7DD3FC" />
                <circle cx="35" cy="76" r="4" fill="#7DD3FC" />
                <circle cx="20" cy="50" r="4" fill="#7DD3FC" />
                <circle cx="35" cy="24" r="4" fill="#7DD3FC" />
                <circle cx="65" cy="24" r="4" fill="#7DD3FC" />
            </svg>
            <span className="text-xl font-bold text-white tracking-tight">
                Dev<span className="text-sky-400">Hub</span>
            </span>
        </div>
    );
}
