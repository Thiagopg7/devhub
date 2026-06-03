import { useEffect, useState } from 'react';

/**
 * Efeitos do corpo do artigo (Blog/Show):
 *  - injeta IDs nos headings e monta a lista para o índice (TOC);
 *  - destaca o heading ativo conforme o scroll;
 *  - adiciona botão "Copiar" em cada bloco de código.
 *
 * @param {React.RefObject} proseRef  ref do container do conteúdo renderizado
 * @param {string} content            HTML sanitizado (dispara recálculo quando muda)
 * @returns {{ headings: Array, activeId: string }}
 */
export default function useArticleContent(proseRef, content) {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    /* Injeta IDs nos headings e monta o TOC */
    useEffect(() => {
        if (!proseRef.current) return;
        const nodes = [...proseRef.current.querySelectorAll('h2, h3')];
        const items = nodes.map((el, i) => {
            if (!el.id) el.id = `h-${i}`;
            return { id: el.id, text: el.textContent, level: el.tagName.toLowerCase() };
        });
        setHeadings(items);
    }, [proseRef, content]);

    /* Destaca o item ativo do TOC durante o scroll */
    useEffect(() => {
        if (headings.length === 0) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter(e => e.isIntersecting);
                if (visible.length > 0) setActiveId(visible[0].target.id);
            },
            { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
        );
        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [headings]);

    /* Injeta botões "Copiar" nos blocos <pre> */
    useEffect(() => {
        if (!proseRef.current) return;
        proseRef.current.querySelectorAll('pre').forEach(pre => {
            if (pre.closest('.codeblock-wrapper')) return;
            const wrapper = document.createElement('div');
            wrapper.className = 'codeblock-wrapper';
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            const btn = document.createElement('button');
            btn.textContent = 'Copiar';
            btn.className = 'codeblock-copy';
            btn.setAttribute('aria-label', 'Copiar código');
            btn.addEventListener('click', () => {
                const code = pre.querySelector('code') || pre;
                navigator.clipboard.writeText(code.textContent ?? '');
                btn.textContent = '✓ Copiado!';
                btn.classList.add('copied');
                setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copied'); }, 2000);
            });
            wrapper.appendChild(btn);
        });
    }, [proseRef, content]);

    return { headings, activeId };
}
