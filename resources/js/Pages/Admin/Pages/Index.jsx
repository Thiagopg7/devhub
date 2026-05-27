import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ToggleActive from "@/Components/Admin/ToggleActive";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaPen, FaTrash, FaSearch, FaEye } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCan } from "@/hooks/useCan";

export default function Index({ pages, filter, trashedCount = 0 }) {
    const can = useCan();
    const { data, setData, get } = useForm({ q: filter?.q || "" });
    const [pending, setPending] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.pages.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q },
        });
    };

    const deleteConfirm = (id) => {
        setPending({
            message: "Deseja realmente excluir esta página? Esta ação não pode ser desfeita.",
            onConfirm: () => router.delete(route("admin.pages.destroy", id), {
                preserveScroll: true,
                onError: () => toast.error("Erro ao excluir a página."),
            }),
        });
    };

    return (
        <>
            <Head title="Páginas" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Páginas</h2>
                        <div className="flex gap-2">
                            {can('pages.delete') && (
                                <NavButton href={route("admin.pages.trashed")} variant="secondary">
                                    Lixeira{trashedCount > 0 && ` (${trashedCount})`}
                                </NavButton>
                            )}
                            {can('pages.create') && (
                                <NavButton href={route("admin.pages.create")}>Cadastrar</NavButton>
                            )}
                        </div>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">

                                <form onSubmit={submit} className="mb-4">
                                    <div className="w-full mb-4">
                                        <Label htmlFor="q" value="Pesquisa" className="!font-semibold !text-base" />
                                        <div className="flex gap-4 items-center">
                                            <Input
                                                id="q"
                                                type="text"
                                                value={data.q}
                                                onChange={(e) => setData("q", e.target.value)}
                                                className="border-gray-300 focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50 mt-1 block w-full"
                                            />
                                            <button type="submit" className="bg-red-600 py-2 px-4 rounded-md text-white">
                                                <FaSearch />
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {pages.data.length > 0 ? (
                                    <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Título</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Slug</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Pesquisável</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ativo</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {pages.data.map((page) => (
                                                <tr key={page.id}>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium dark:text-gray-100">{page.title}</div>
                                                        {page.subtitle && (
                                                            <div className="text-xs text-gray-400 mt-0.5">{page.subtitle}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                        {page.slug}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {page.is_searchable ? (
                                                            <Eye size={16} className="mx-auto text-sky-400" title="Pesquisável" />
                                                        ) : (
                                                            <EyeOff size={16} className="mx-auto text-gray-300 dark:text-gray-600" title="Não pesquisável" />
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <ToggleActive id={page.id} model="page" value={page.is_active} />
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            {!can('pages.edit') && can('pages.view') && (
                                                                <NavButton href={route("admin.pages.edit", page.id)} title="Visualizar">
                                                                    <FaEye />
                                                                </NavButton>
                                                            )}
                                                            {can('pages.edit') && (
                                                                <NavButton href={route("admin.pages.edit", page.id)} title="Editar">
                                                                    <FaPen />
                                                                </NavButton>
                                                            )}
                                                            {can('pages.delete') && (
                                                                <ActionButton theme="light" onClick={() => deleteConfirm(page.id)}>
                                                                    <FaTrash className="text-white" />
                                                                </ActionButton>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                        Nenhuma página encontrada.
                                    </div>
                                )}

                                <div className="w-full mt-4">
                                    <Pagination links={pages.links} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <ConfirmModal
                show={!!pending}
                message={pending?.message}
                onConfirm={() => { pending?.onConfirm(); setPending(null); }}
                onCancel={() => setPending(null)}
            />
        </>
    );
}
