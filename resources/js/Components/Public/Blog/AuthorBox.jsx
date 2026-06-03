import Reveal from '@/Components/Public/Reveal';

/** Box de autoria (estático) exibido ao fim do artigo. */
export default function AuthorBox() {
    return (
        <Reveal className="flex items-start gap-5 rounded-2xl p-6 mt-14"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="w-16 h-16 rounded-2xl grid place-items-center font-display font-bold text-xl text-white shrink-0"
                style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent-2))' }}>
                DH
            </div>
            <div>
                <div className="font-display font-semibold text-white text-base">Equipe DevHub</div>
                <div className="text-xs font-mono mb-3" style={{ color: 'var(--accent)' }}>Engenharia &amp; Conteúdo</div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
                    Conteúdo produzido pela equipe do DevHub — desenvolvedores que escrevem sobre o que usam no dia a dia.
                    Tutoriais testados, arquiteturas reais e nenhum "hello world" sem propósito.
                </p>
            </div>
        </Reveal>
    );
}
