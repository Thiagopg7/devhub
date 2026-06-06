import {
    Server, Monitor, Brain, Database, Briefcase, Wrench,
    Code, Cloud, Cpu, Layers, Globe, Terminal, GitBranch,
    Smartphone, ShieldCheck, Sparkles, Rocket, BookOpen,
    TrendingUp, Palette,
} from 'lucide-react';

export const CATEGORY_ICONS = {
    Server, Monitor, Brain, Database, Briefcase, Wrench,
    Code, Cloud, Cpu, Layers, Globe, Terminal, GitBranch,
    Smartphone, ShieldCheck, Sparkles, Rocket, BookOpen,
    TrendingUp, Palette,
};

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS);

export const DEFAULT_CATEGORY_ICON = 'Layers';

export function resolveCategoryIcon(name) {
    return CATEGORY_ICONS[name] || CATEGORY_ICONS[DEFAULT_CATEGORY_ICON];
}
