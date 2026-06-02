import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

const CHIPS = [
    { label: 'Laravel',   delay: '0s',    pos: 'top-[11%] left-[8%]',   bg: 'rgba(248,80,50,.16)',   color: '#ff6b53',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><path d="M3 6l4 2v7l5 3 5-3V9l-5-3 5-2.6 4 2"/></svg> },
    { label: 'React',     delay: '-1.4s', pos: 'top-[6%] right-[12%]',  bg: 'rgba(97,218,251,.16)',  color: '#61dafb',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{width:16,height:16}}><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg> },
    { label: 'Inertia',   delay: '-2.6s', pos: 'top-[46%] right-[2%]',  bg: 'rgba(123,134,255,.16)', color: '#a4abff',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><path d="M5 6h14M5 12h9M5 18h14"/></svg> },
    { label: 'Tailwind',  delay: '-3.4s', pos: 'bottom-[12%] right-[16%]', bg: 'rgba(56,189,248,.16)', color: '#38bdf8',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{width:16,height:16}}><path d="M6.5 9C8 6 10 5 12.5 6c1.5.6 2 1.7 3.2 2.6 1.3 1 2.8 1 4.3-.3-1.5 3-3.5 4-6 3-1.5-.6-2-1.7-3.2-2.6C9.5 7.7 8 7.7 6.5 9zM2 14.4c1.5-3 3.5-4 6-3 1.5.6 2 1.7 3.2 2.6 1.3 1 2.8 1 4.3-.3-1.5 3-3.5 4-6 3-1.5-.6-2-1.7-3.2-2.6-1.3-1-2.8-1-4.3.3z"/></svg> },
    { label: 'MySQL',     delay: '-2s',   pos: 'bottom-[8%] left-[12%]',  bg: 'rgba(47,217,194,.16)', color: '#2fd9c2',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{width:16,height:16}}><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/></svg> },
    { label: 'API REST',  delay: '-4.2s', pos: 'top-[40%] left-[0%]',    bg: 'rgba(255,255,255,.1)', color: '#cfe3f5',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12"/></svg> },
];

export default function HeroBanner() {
    return (
        <section className="relative overflow-hidden pt-[70px] pb-24" style={{ background: '#0a131e' }}>
            {/* Glow effects */}
            <div className="absolute pointer-events-none" style={{ width: 900, height: 900, right: -200, top: -360, background: 'radial-gradient(circle,rgba(60,189,248,0.16) 0%,transparent 62%)', filter: 'blur(8px)' }} />
            <div className="absolute pointer-events-none" style={{ width: 620, height: 620, left: -240, bottom: -260, background: 'radial-gradient(circle,rgba(123,134,255,0.14) 0%,transparent 64%)' }} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">

                    {/* Left column — copy */}
                    <div>
                        {/* Badge */}
                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] tracking-[0.06em] border rounded-full px-[15px] py-[7px]"
                            style={{ color: '#bfe6fb', background: 'rgba(60,189,248,0.08)', borderColor: 'rgba(60,189,248,0.28)' }}>
                            <span className="w-[7px] h-[7px] rounded-full shrink-0"
                                style={{ background: '#3cbdf8', boxShadow: '0 0 0 4px rgba(60,189,248,0.18)', animation: 'chip-float 2.4s ease-in-out infinite' }} />
                            Hub de Inovação &amp; Tecnologia
                        </span>

                        {/* Headline */}
                        <h1 className="font-display font-semibold leading-[1.02] tracking-[-0.03em] mt-5 mb-0"
                            style={{ fontSize: 'clamp(40px,5.6vw,70px)' }}>
                            Conhecimento técnico<br />
                            para <span style={{ background: 'linear-gradient(100deg,#3cbdf8 10%,#8fe0ff 55%,#7b86ff 110%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>construir o futuro.</span>
                        </h1>

                        <p className="mt-6 max-w-[46ch]" style={{ color: '#b6c5d8', fontSize: 'clamp(16px,1.4vw,18.5px)' }}>
                            Artigos práticos, insights e tendências sobre desenvolvimento, tecnologia e inovação — para quem vive de colocar a mão no código.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3 mt-9">
                            <Link href="/blog"
                                className="inline-flex items-center gap-2.5 px-[22px] py-[14px] rounded-xl font-semibold text-[15px] transition-all hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(180deg,#3cbdf8,#2a9be0)', color: '#03121d', boxShadow: '0 12px 30px -12px rgba(60,189,248,0.4)' }}>
                                Explorar Posts
                                <ArrowRight size={17} />
                            </Link>
                            <a href="#newsletter"
                                className="inline-flex items-center gap-2.5 px-[22px] py-[14px] rounded-xl font-semibold text-[15px] transition-all hover:-translate-y-0.5"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(150,178,208,0.24)', color: '#eaf1fa' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor='#3cbdf8'; e.currentTarget.style.background='rgba(60,189,248,0.07)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(150,178,208,0.24)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}>
                                Receber novidades
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center flex-wrap gap-7 mt-10">
                            <div>
                                <div className="font-display font-semibold text-[26px] leading-none tracking-tight text-white">
                                    +<span style={{ color: '#3cbdf8' }}>120</span>
                                </div>
                                <div className="text-[12.5px] mt-1" style={{ color: '#7b8da3' }}>artigos publicados</div>
                            </div>
                            <div className="w-px h-9" style={{ background: 'rgba(150,178,208,0.12)' }} />
                            <div>
                                <div className="font-display font-semibold text-[26px] leading-none tracking-tight text-white">6</div>
                                <div className="text-[12.5px] mt-1" style={{ color: '#7b8da3' }}>trilhas de conteúdo</div>
                            </div>
                            <div className="w-px h-9" style={{ background: 'rgba(150,178,208,0.12)' }} />
                            <div>
                                <div className="font-display font-semibold text-[26px] leading-none tracking-tight text-white">semanal</div>
                                <div className="text-[12.5px] mt-1" style={{ color: '#7b8da3' }}>novos conteúdos</div>
                            </div>
                        </div>
                    </div>

                    {/* Right column — visual panel */}
                    <div className="hidden lg:block relative" style={{ height: 'clamp(430px,42vw,520px)' }}>
                        <div className="absolute inset-0 rounded-[30px] overflow-hidden"
                            style={{ background: 'linear-gradient(160deg,rgba(27,46,70,0.55),rgba(13,24,40,0.4))', border: '1px solid rgba(150,178,208,0.24)', boxShadow: '0 40px 80px -30px rgba(0,0,0,0.75)' }}>

                            {/* Spinning rings */}
                            <div className="absolute" style={{ left: '50%', top: '50%', width: 280, height: 280, marginLeft: -140, marginTop: -140, border: '1px dashed rgba(60,189,248,0.28)', borderRadius: '50%', transformOrigin: 'center', animation: 'ring-spin 34s linear infinite', transform: 'translate(-50%,-50%)' }} />
                            <div className="absolute" style={{ left: '50%', top: '50%', width: 420, height: 420, marginLeft: -210, marginTop: -210, border: '1px dashed rgba(123,134,255,0.18)', borderRadius: '50%', animation: 'ring-spin-rev 52s linear infinite', transform: 'translate(-50%,-50%)' }} />

                            {/* Center core */}
                            <div className="absolute z-[3] grid place-items-center rounded-[26px]"
                                style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 96, height: 96, background: 'linear-gradient(160deg,#1b2e46,#101f30)', border: '1px solid rgba(150,178,208,0.24)', boxShadow: '0 0 0 8px rgba(60,189,248,0.06), 0 20px 50px -16px rgba(0,0,0,0.7)' }}>
                                <svg width="46" height="46" viewBox="0 0 32 32" fill="none" style={{ color: '#3cbdf8' }}>
                                    <path d="M16 2v28M2 16h28M5.8 5.8l20.4 20.4M26.2 5.8L5.8 26.2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
                                    <circle cx="16" cy="16" r="4.4" fill="#101f30" stroke="currentColor" strokeWidth="2.4"/>
                                </svg>
                            </div>

                            {/* Tech chips */}
                            {CHIPS.map((chip) => (
                                <div key={chip.label}
                                    className={`absolute z-[4] flex items-center gap-2 font-mono text-[13px] font-medium rounded-full px-3 py-2 ${chip.pos}`}
                                    style={{ background: 'rgba(16,31,48,0.82)', backdropFilter: 'blur(6px)', border: '1px solid rgba(150,178,208,0.24)', boxShadow: '0 18px 40px -22px rgba(0,0,0,0.7)', animation: `chip-float 6s ease-in-out ${chip.delay} infinite`, color: '#eaf1fa' }}>
                                    <span className="w-[22px] h-[22px] rounded-[6px] grid place-items-center shrink-0 text-[0px]" style={{ background: chip.bg, color: chip.color }}>
                                        {chip.icon}
                                    </span>
                                    {chip.label}
                                </div>
                            ))}

                            {/* Live card */}
                            <div className="absolute left-4 bottom-4 right-4 z-[5] flex items-center gap-3 rounded-2xl px-3.5 py-3"
                                style={{ background: 'rgba(10,19,30,0.78)', backdropFilter: 'blur(10px)', border: '1px solid rgba(150,178,208,0.12)' }}>
                                <div className="w-[46px] h-[46px] rounded-[10px] shrink-0" style={{ background: 'linear-gradient(135deg,#101f30,#15243a)' }} />
                                <div className="min-w-0 flex-1">
                                    <div className="font-mono text-[10.5px] tracking-[0.08em] uppercase" style={{ color: '#3cbdf8' }}>Em alta · Frontend</div>
                                    <div className="text-[13.5px] font-semibold text-white truncate">React com Inertia.js: SPA sem API REST</div>
                                </div>
                                <ArrowRight size={18} style={{ color: '#7b8da3', flexShrink: 0 }} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
