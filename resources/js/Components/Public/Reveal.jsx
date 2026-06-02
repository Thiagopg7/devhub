import { useEffect, useRef } from 'react';

export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...props }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (!('IntersectionObserver' in window)) {
            el.classList.add('in');
            return;
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay) el.style.transitionDelay = `${delay}ms`;
                    el.classList.add('in');
                    io.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [delay]);

    return (
        <Tag ref={ref} className={`reveal ${className}`} {...props}>
            {children}
        </Tag>
    );
}
