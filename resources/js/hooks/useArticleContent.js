import { useEffect, useState } from 'react';

async function copyText(text) {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
    } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: '0', pointerEvents: 'none' });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }
}

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
            btn.addEventListener('click', async () => {
                const code = pre.querySelector('code') || pre;
                try {
                    await copyText(code.textContent ?? '');
                    btn.textContent = '✓ Copiado!';
                    btn.classList.add('copied');
                    setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copied'); }, 2000);
                } catch {}
            });
            wrapper.appendChild(btn);
        });
    }, [proseRef, content]);

    return { headings, activeId };
}
