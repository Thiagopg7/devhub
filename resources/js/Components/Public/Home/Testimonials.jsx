import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Reveal from '@/Components/Public/Reveal';
import SectionHead from '@/Components/Public/SectionHead';
import 'swiper/css';
import 'swiper/css/pagination';

const GRADIENTS = [
    'linear-gradient(135deg,var(--accent),var(--accent-2))',
    'linear-gradient(135deg,var(--violet),#5560e6)',
    'linear-gradient(135deg,var(--teal),#1b9e8c)',
    'linear-gradient(135deg,#e66,#c44)',
];

function initials(name) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('');
}

function Stars() {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" fill="var(--gold)" width="14" height="14">
                    <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/>
                </svg>
            ))}
        </div>
    );
}

function TestimonialCard({ testimonial, index }) {
    const gradient = GRADIENTS[index % GRADIENTS.length];

    return (
        <figure className="flex flex-col h-full rounded-2xl p-7"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-5xl leading-none mb-4 font-display" style={{ color: 'var(--accent)', opacity: 0.5 }}>&ldquo;</div>
            <p className="flex-1 text-sm leading-relaxed mb-5 italic" style={{ color: 'var(--text-muted)' }}>
                {testimonial.content}
            </p>
            <Stars />
            <figcaption className="flex items-center gap-3 mt-5">
                {testimonial.avatar_image_url ? (
                    <img
                        src={testimonial.avatar_image_url}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full grid place-items-center font-display font-semibold text-sm text-white shrink-0"
                        style={{ background: gradient }}>
                        {initials(testimonial.name)}
                    </div>
                )}
                <div>
                    <div className="text-sm font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {testimonial.role}{testimonial.company ? ` — ${testimonial.company}` : ''}
                    </div>
                </div>
            </figcaption>
        </figure>
    );
}

export default function Testimonials({ testimonials = [] }) {
    if (testimonials.length === 0) return null;

    return (
        <section style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Reveal>
                    <SectionHead eyebrow="O que dizem" title="Quem lê, recomenda" subtitle="A comunidade de devs que acompanha o DevHub no dia a dia." />
                </Reveal>

                <Reveal>
                    <Swiper
                        modules={[Pagination]}
                        grabCursor
                        spaceBetween={24}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="public-swiper"
                    >
                        {testimonials.map((t, i) => (
                            <SwiperSlide key={t.id} style={{ height: 'auto' }}>
                                <TestimonialCard testimonial={t} index={i} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Reveal>
            </div>
        </section>
    );
}
