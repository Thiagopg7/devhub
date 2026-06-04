import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Globe, Server, Database, Brain, Cloud, Briefcase, Shield, Code2, Cpu, LayoutGrid } from 'lucide-react';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

export function estimateReadTime(content) {
    if (!content) return 1;
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

export function initials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('') || 'DH';
}

const CATEGORY_ICON_MAP = [
    [['frontend', 'front-end'],          Globe],
    [['backend', 'back-end', 'servidor'], Server],
    [['banco', 'database', 'dados', 'db', 'data'], Database],
    [['ia', 'intelig', 'machine', 'ml'], Brain],
    [['devops', 'infra', 'cloud'],        Cloud],
    [['carreira', 'emprego', 'career'],   Briefcase],
    [['segurança', 'security'],           Shield],
    [['mobile'],                          Code2],
    [['all'],                             LayoutGrid],
];

export function categoryIcon(nameOrSlug) {
    if (!nameOrSlug) return Code2;
    const key = nameOrSlug.toLowerCase();
    for (const [tokens, Icon] of CATEGORY_ICON_MAP) {
        if (tokens.some(t => key.includes(t))) return Icon;
    }
    return Cpu;
}
