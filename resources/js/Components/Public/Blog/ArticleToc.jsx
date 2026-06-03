import ShareButtons from '@/Components/Public/ShareButtons';

/** Índice lateral (TOC) do artigo + bloco de compartilhar. */
export default function ArticleToc({ headings, activeId, pageUrl, title }) {
    const hasToc = headings.length > 0;

    return (
        <aside className="hidden lg:block sticky top-24 shrink-0" style={{ width: 248 }}>
            {hasToc && (
                <>
                    <h5 className="font-mono text-[11.5px] uppercase tracking-[.12em] mb-4" style={{ color: 'var(--text-muted)' }}>
                        Neste artigo
                    </h5>
                    <ul className="flex flex-col gap-0.5 m-0 p-0 list-none"
                        style={{ borderLeft: '1px solid rgba(150,178,208,0.15)' }}>
                        {headings.map(({ id, text, level }) => {
                            const isActive = activeId === id;
                            return (
                                <li key={id} className="m-0 p-0">
                                    <a href={`#${id}`}
                                        className={`block text-[13.5px] leading-snug transition-colors${isActive ? '' : ' toc-link'}`}
                                        style={{
                                            padding: '8px 0 8px 16px',
                                            marginLeft: -1,
                                            paddingLeft: level === 'h3' ? 28 : 16,
                                            borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                                            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                                            fontWeight: isActive ? 600 : 400,
                                        }}>
                                        {text}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}

            <div className={`pt-5 ${hasToc ? 'mt-7' : ''}`}
                style={hasToc ? { borderTop: '1px solid var(--border)' } : {}}>
                <div className="font-mono text-[11.5px] uppercase tracking-[.12em] mb-3" style={{ color: 'var(--text-muted)' }}>
                    Compartilhar
                </div>
                <ShareButtons url={pageUrl} title={title} />
            </div>
        </aside>
    );
}
