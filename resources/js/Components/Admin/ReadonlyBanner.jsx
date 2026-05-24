import { Eye } from "lucide-react";

export default function ReadonlyBanner() {
    return (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            <Eye size={16} className="shrink-0" />
            Modo de visualização — você não tem permissão para editar este conteúdo.
        </div>
    );
}
