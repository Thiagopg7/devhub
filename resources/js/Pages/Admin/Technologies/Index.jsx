import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ToggleActive from "@/Components/Admin/ToggleActive";
import Input from "@/Components/Admin/Input";
import { FaPen, FaTrash, FaSearch } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Index({ technologies, filter }) {
    const { data, setData, get } = useForm({ q: filter?.q || "" });

    const search = (e) => {
        e.preventDefault();
        get(route("admin.technologies.index"), { preserveState: true, preserveScroll: true });
    };

    const deleteConfirm = (id) => {
        if (confirm("Deseja realmente excluir esta tecnologia?")) {
            router.delete(route("admin.technologies.destroy", id), {
                preserveScroll: true,
                onSuccess: () => toast.success("Tecnologia excluída com sucesso!"),
                onError: () => toast.error("Erro ao excluir a tecnologia."),
            });
        }
    };

    return (
        <>
            <Head title="Tecnologias" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Tecnologias</h2>
                        <NavButton href={route("admin.technologies.create")}>Cadastrar</NavButton>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">

                                <form onSubmit={search} className="mb-4">
                                    <div className="flex gap-3 items-center">
                                        <Input
                                            type="text"
                                            value={data.q}
                                            onChange={(e) => setData("q", e.target.value)}
                                            placeholder="Buscar por nome…"
                                            className="w-full max-w-sm"
                                        />
                                        <button type="submit" className="bg-red-600 py-2 px-4 rounded-md text-white">
                                            <FaSearch />
                                        </button>
                                    </div>
                                </form>

                                {technologies.data.length > 0 ? (
                                    <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ícone</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">URL</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ordem</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ativo</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {technologies.data.map((tech) => (
                                                <tr key={tech.id}>
                                                    <td className="px-6 py-4">
                                                        {tech.icon_url ? (
                                                            <img
                                                                src={tech.icon_url}
                                                                alt={tech.name}
                                                                className="w-8 h-8 rounded object-contain bg-gray-100 dark:bg-gray-700 p-0.5"
                                                            />
                                                        ) : (
                                                            <span className="inline-block w-8 h-8 rounded bg-gray-100 dark:bg-gray-700" />
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium dark:text-gray-100">{tech.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                        <a
                                                            href={tech.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 hover:text-sky-500 transition-colors"
                                                        >
                                                            {tech.url}
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">{tech.order}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <ToggleActive id={tech.id} model="technology" value={tech.is_active} />
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            <NavButton href={route("admin.technologies.edit", tech.id)} title="Editar">
                                                                <FaPen />
                                                            </NavButton>
                                                            <ActionButton theme="light" onClick={() => deleteConfirm(tech.id)}>
                                                                <FaTrash className="text-white" />
                                                            </ActionButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                        Nenhuma tecnologia encontrada.
                                    </div>
                                )}

                                <div className="w-full mt-4">
                                    <Pagination links={technologies.links} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
