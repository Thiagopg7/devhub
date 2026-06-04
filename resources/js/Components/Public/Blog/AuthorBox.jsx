import Reveal from '@/Components/Public/Reveal';
import { initials } from '@/lib/utils';

const DEFAULT_BIO = 'Conteúdo produzido pela equipe do DevHub — desenvolvedores que escrevem sobre o que usam no dia a dia. Tutoriais testados, arquiteturas reais e nenhum "hello world" sem propósito.';

/** Box de autoria exibido ao fim do artigo. */
export default function AuthorBox({ author = null }) {
    const name = author?.name || 'Equipe DevHub';
    const bio = author?.bio || DEFAULT_BIO;
    const avatar = author?.avatar_image_url || null;

    return (
        <Reveal className="flex items-start gap-5 rounded-2xl p-6 mt-14"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {avatar ? (
                <img src={avatar} alt={name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
            ) : (
                <div className="w-16 h-16 rounded-2xl grid place-items-center font-display font-bold text-xl text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent-2))' }}>
                    {author ? initials(name) : 'DH'}
                </div>
            )}
            <div>
                <div className="font-display font-semibold text-white text-base">{name}</div>
                <div className="text-xs font-mono mb-3" style={{ color: 'var(--accent)' }}>Engenharia &amp; Conteúdo</div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
                    {bio}
                </p>
            </div>
        </Reveal>
    );
}
