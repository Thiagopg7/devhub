import {
    Server, Monitor, Brain, Database, Briefcase, Wrench,
    Code, Cloud, Cpu, Layers, Globe, Terminal, GitBranch,
    Smartphone, ShieldCheck, Sparkles, Rocket, BookOpen,
    TrendingUp, Palette,
} from 'lucide-react';

/**
 * Conjunto curado de ícones lucide para categorias ("trilhas").
 * Mantém em sincronia com CategoryRequest::ICON_KEYS (validação no backend).
 */
export const CATEGORY_ICONS = {
    Server, Monitor, Brain, Database, Briefcase, Wrench,
    Code, Cloud, Cpu, Layers, Globe, Terminal, GitBranch,
    Smartphone, ShieldCheck, Sparkles, Rocket, BookOpen,
    TrendingUp, Palette,
};

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS);

export const DEFAULT_CATEGORY_ICON = 'Layers';

/** Resolve o componente do ícone a partir do nome salvo; cai no padrão se vazio/inválido. */
export function resolveCategoryIcon(name) {
    return CATEGORY_ICONS[name] || CATEGORY_ICONS[DEFAULT_CATEGORY_ICON];
}
