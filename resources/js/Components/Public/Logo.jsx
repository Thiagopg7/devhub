export default function Logo({ name = 'DevHub', className = '' }) {
    const [dev, hub] = name.startsWith('Dev') ? ['Dev', name.slice(3)] : [name, ''];

    return (
        <div className={`flex items-center gap-2.5 font-display font-semibold text-xl tracking-tight ${className}`}>
            <svg className="shrink-0" width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16 2v28M2 16h28M5.8 5.8l20.4 20.4M26.2 5.8L5.8 26.2" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round"/>
                <circle cx="16" cy="16" r="4.4" fill="var(--base)" stroke="var(--accent)" strokeWidth="2.4"/>
            </svg>
            <span className="text-white">{dev && <b>{dev}</b>}<span style={{ color: 'var(--accent)' }}>{hub || name}</span></span>
        </div>
    );
}
