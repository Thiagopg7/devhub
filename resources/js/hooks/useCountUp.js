import { useEffect, useState } from 'react';

/**
 * Anima um número de 0 até `target` com easing easeOutCubic.
 * Respeita `prefers-reduced-motion` exibindo o valor final direto.
 */
export default function useCountUp(target, duration = 1400) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (target <= 0) { setValue(target); return; }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setValue(target); return; }

        let raf;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            setValue(Math.round(target * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);

    return value;
}
