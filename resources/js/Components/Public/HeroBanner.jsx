import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import useCountUp from '@/hooks/useCountUp';

function useParticleNet(canvasRef) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, dpr, nodes = [], raf;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function resize() {
            const r = canvas.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.width = r.width * dpr;
            h = canvas.height = r.height * dpr;
            const count = Math.max(18, Math.round((r.width * r.height) / 9000));
            nodes = Array.from({ length: count }, () => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.18 * dpr,
                vy: (Math.random() - 0.5) * 0.18 * dpr,
                r: (Math.random() * 1.6 + 1) * dpr,
            }));
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            const linkDist = 120 * dpr;
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
                for (let j = i + 1; j < nodes.length; j++) {
                    const m = nodes[j];
                    const d = Math.hypot(n.x - m.x, n.y - m.y);
                    if (d < linkDist) {
                        ctx.strokeStyle = `rgba(60,189,248,${(1 - d / linkDist) * 0.22})`;
                        ctx.lineWidth = dpr;
                        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
                    }
                }
            }
            for (const n of nodes) {
                ctx.fillStyle = 'rgba(150,200,240,0.55)';
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        }

        resize();
        if (reduce) { draw(); cancelAnimationFrame(raf); } else draw();
        let t;
        const onResize = () => { clearTimeout(t); t = setTimeout(() => { cancelAnimationFrame(raf); resize(); if (!reduce) draw(); }, 180); };
        window.addEventListener('resize', onResize);
        return () => { cancelAnimationFrame(raf); clearTimeout(t); window.removeEventListener('resize', onResize); };
    }, [canvasRef]);
}

const CHIPS = [
    { label: 'Laravel',    delay: '0s',    pos: { top: '10%',    left: '7%'   }, bg: 'rgba(248,80,50,.16)',   color: '#ff6b53',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><path d="M3 6l4 2v7l5 3 5-3V9l-5-3 5-2.6 4 2"/></svg> },
    { label: 'React',      delay: '-1.4s', pos: { top: '8%',     right: '8%'  }, bg: 'rgba(97,218,251,.16)',  color: '#61dafb',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{width:16,height:16}}><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg> },
    { label: 'Next.js',    delay: '-4.8s', pos: { top: '29%',    left: '8%'   }, bg: 'rgba(255,255,255,.10)', color: '#e8f0fa',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><circle cx="12" cy="12" r="10"/><path d="M9 8l7 8M16 8v8"/></svg> },
    { label: 'Vue',        delay: '-2.6s', pos: { top: '34%',    right: '4%'  }, bg: 'rgba(66,211,146,.16)',  color: '#42d392',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{width:16,height:16}}><path d="M12 2L2 4l10 16L22 4l-10-2zM12 14.8L5.6 5.4H8.8l3.2 5.4 3.2-5.4h3.2L12 14.8z" opacity=".9"/></svg> },
    { label: 'GraphQL',    delay: '-1.8s', pos: { top: '57%',    left: '4%'   }, bg: 'rgba(229,53,171,.16)',  color: '#e535ab',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><polygon points="12 2 21.5 7.5 21.5 16.5 12 22 2.5 16.5 2.5 7.5"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity=".6"/><line x1="12" y1="4" x2="12" y2="10"/><line x1="12" y1="14" x2="12" y2="20"/><line x1="19.4" y1="8" x2="14" y2="11"/><line x1="10" y1="13" x2="4.6" y2="16"/><line x1="4.6" y1="8" x2="10" y2="11"/><line x1="14" y1="13" x2="19.4" y2="16"/></svg> },
    { label: 'TypeScript', delay: '-3.4s', pos: { top: '55%',    right: '6%'  }, bg: 'rgba(49,120,198,.18)',  color: '#5b9bd5',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12h8M14 9v6"/></svg> },
    { label: 'Postgres',   delay: '-3.0s', pos: { bottom: '20%', left: '4%'   }, bg: 'rgba(47,217,194,.16)',  color: 'var(--teal)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{width:16,height:16}}><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/></svg> },
    { label: 'Tailwind',   delay: '-2s',   pos: { bottom: '18%', right: '8%'  }, bg: 'rgba(56,189,248,.16)',  color: '#38bdf8',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{width:16,height:16}}><path d="M6.5 9C8 6 10 5 12.5 6c1.5.6 2 1.7 3.2 2.6 1.3 1 2.8 1 4.3-.3-1.5 3-3.5 4-6 3-1.5-.6-2-1.7-3.2-2.6C9.5 7.7 8 7.7 6.5 9zM2 14.4c1.5-3 3.5-4 6-3 1.5.6 2 1.7 3.2 2.6 1.3 1 2.8 1 4.3-.3-1.5 3-3.5 4-6 3-1.5-.6-2-1.7-3.2-2.6-1.3-1-2.8-1-4.3.3z"/></svg> },
    { label: 'Docker',     delay: '-0.8s', pos: { bottom: '7%',  left: '14%'  }, bg: 'rgba(36,150,237,.18)',  color: '#2496ed',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><rect x="2" y="10" width="4" height="3" rx="1"/><rect x="7" y="10" width="4" height="3" rx="1"/><rect x="12" y="10" width="4" height="3" rx="1"/><rect x="7" y="6" width="4" height="3" rx="1"/><rect x="12" y="6" width="4" height="3" rx="1"/><path d="M2 15.5c1.5 2 4 2.5 6.5 2.5h2.5c4 0 7-2 8-5-.8.2-1.6.3-2.5 0-.5 1.2-1 1-2 1-1.2 0-1.5-.8-1.5-1H2z"/></svg> },
    { label: 'Node.js',    delay: '-4.2s', pos: { bottom: '7%',  right: '20%' }, bg: 'rgba(104,160,99,.18)',  color: '#84cc70',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><path d="M12 2l8.5 4.9v9.8L12 21.6l-8.5-4.9V6.9L12 2z"/><path d="M9 10v4M9 10c0-1.1.9-2 2-2h1a2 2 0 010 4h-1M15 8v8"/></svg> },
];

export default function HeroBanner({ stats = {} }) {
    const canvasRef = useRef(null);
    useParticleNet(canvasRef);

    const publishedPosts = stats.publishedPosts ?? 0;
    const categories = stats.categories ?? 0;

    // Arredonda os artigos pra baixo na dezena (ex.: 28 → 20) para exibir "+20"
    const postsTarget = publishedPosts >= 10 ? Math.floor(publishedPosts / 10) * 10 : publishedPosts;
    const postsCount = useCountUp(postsTarget);
    const categoriesCount = useCountUp(categories);

    return (
        <section className="relative overflow-hidden pt-[70px] pb-24" style={{ background: 'var(--base)' }}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.45 }} />
            <div className="absolute pointer-events-none" style={{ width: 900, height: 900, right: -200, top: -360, background: 'radial-gradient(circle,rgba(60,189,248,0.16) 0%,transparent 62%)', filter: 'blur(8px)' }} />
            <div className="absolute pointer-events-none" style={{ width: 620, height: 620, left: -240, bottom: -260, background: 'radial-gradient(circle,rgba(123,134,255,0.14) 0%,transparent 64%)' }} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">

                    <div>
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] tracking-[0.06em] border rounded-full px-[15px] py-[7px]"
                            style={{ color: '#bfe6fb', background: 'rgba(60,189,248,0.08)', borderColor: 'rgba(60,189,248,0.28)' }}>
                            <span className="w-[7px] h-[7px] rounded-full shrink-0"
                                style={{ background: 'var(--accent)', boxShadow: '0 0 0 4px rgba(60,189,248,0.18)', animation: 'chip-float 2.4s ease-in-out infinite' }} />
                            Hub de Inovação &amp; Tecnologia
                        </span>

                        <h1 className="font-display font-semibold leading-[1.02] tracking-[-0.03em] mt-5 mb-0"
                            style={{ fontSize: 'clamp(40px,5.6vw,70px)' }}>
                            Conhecimento técnico<br />
                            para <span style={{ background: 'linear-gradient(100deg,var(--accent) 10%,#8fe0ff 55%,var(--violet) 110%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>construir o futuro.</span>
                        </h1>

                        <p className="mt-6 max-w-[46ch]" style={{ color: 'var(--text-body)', fontSize: 'clamp(16px,1.4vw,18.5px)' }}>
                            Artigos práticos, insights e tendências sobre desenvolvimento, tecnologia e inovação — para quem vive de colocar a mão no código.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-9">
                            <Link href="/blog"
                                className="inline-flex items-center gap-2.5 px-[22px] py-[14px] rounded-xl font-semibold text-[15px] transition-all hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(180deg,var(--accent),var(--accent-2))', color: 'var(--accent-ink)', boxShadow: '0 12px 30px -12px rgba(60,189,248,0.4)' }}>
                                Explorar Posts
                                <ArrowRight size={17} />
                            </Link>
                            <a href="#newsletter"
                                className="inline-flex items-center gap-2.5 px-[22px] py-[14px] rounded-xl font-semibold text-[15px] transition-all hover:-translate-y-0.5"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-s)', color: 'var(--text-bright)' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.background='rgba(60,189,248,0.07)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-s)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}>
                                Receber novidades
                            </a>
                        </div>

                        <div className="flex items-center flex-wrap gap-7 mt-10">
                            <div>
                                <div className="font-display font-semibold text-[26px] leading-none tracking-tight text-white">
                                    +<span style={{ color: 'var(--accent)' }}>{postsCount}</span>
                                </div>
                                <div className="text-[12.5px] mt-1" style={{ color: 'var(--text-muted)' }}>artigos publicados</div>
                            </div>
                            <div className="w-px h-9" style={{ background: 'var(--border)' }} />
                            <div>
                                <div className="font-display font-semibold text-[26px] leading-none tracking-tight text-white">{categoriesCount}</div>
                                <div className="text-[12.5px] mt-1" style={{ color: 'var(--text-muted)' }}>trilhas de conteúdo</div>
                            </div>
                            <div className="w-px h-9" style={{ background: 'var(--border)' }} />
                            <div>
                                <div className="font-display font-semibold text-[26px] leading-none tracking-tight text-white">semanal</div>
                                <div className="text-[12.5px] mt-1" style={{ color: 'var(--text-muted)' }}>novos conteúdos</div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block relative" style={{ height: 'clamp(430px,42vw,520px)' }}>
                        <div className="absolute inset-0 rounded-[30px] overflow-hidden"
                            style={{ background: 'linear-gradient(160deg,rgba(27,46,70,0.55),rgba(13,24,40,0.4))', border: '1px solid var(--border-s)', boxShadow: '0 40px 80px -30px rgba(0,0,0,0.75)' }}>

                            <div className="absolute" style={{ left: '50%', top: '50%', width: 280, height: 280, marginLeft: -140, marginTop: -140, border: '1px dashed rgba(60,189,248,0.28)', borderRadius: '50%', transformOrigin: 'center', animation: 'ring-spin 34s linear infinite', transform: 'translate(-50%,-50%)' }} />
                            <div className="absolute" style={{ left: '50%', top: '50%', width: 420, height: 420, marginLeft: -210, marginTop: -210, border: '1px dashed rgba(123,134,255,0.18)', borderRadius: '50%', animation: 'ring-spin-rev 52s linear infinite', transform: 'translate(-50%,-50%)' }} />

                            <div className="absolute z-[3] grid place-items-center rounded-[26px]"
                                style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 96, height: 96, background: 'linear-gradient(160deg,var(--surface-3),var(--surface))', border: '1px solid var(--border-s)', boxShadow: '0 0 0 8px rgba(60,189,248,0.06), 0 20px 50px -16px rgba(0,0,0,0.7)' }}>
                                <svg width="46" height="46" viewBox="0 0 32 32" fill="none" style={{ color: 'var(--accent)' }}>
                                    <path d="M16 2v28M2 16h28M5.8 5.8l20.4 20.4M26.2 5.8L5.8 26.2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
                                    <circle cx="16" cy="16" r="4.4" fill="var(--surface)" stroke="currentColor" strokeWidth="2.4"/>
                                </svg>
                            </div>

                            {CHIPS.map((chip) => (
                                <div key={chip.label}
                                    className="absolute z-[4] flex items-center gap-2 font-mono text-[13px] font-medium rounded-full px-3 py-2"
                                    style={{ ...chip.pos, background: 'rgba(16,31,48,0.82)', backdropFilter: 'blur(6px)', border: '1px solid var(--border-s)', boxShadow: '0 18px 40px -22px rgba(0,0,0,0.7)', animation: `chip-float 6s ease-in-out ${chip.delay} infinite`, color: 'var(--text-bright)' }}>
                                    <span className="w-[22px] h-[22px] rounded-[6px] grid place-items-center shrink-0 text-[0px]" style={{ background: chip.bg, color: chip.color }}>
                                        {chip.icon}
                                    </span>
                                    {chip.label}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
