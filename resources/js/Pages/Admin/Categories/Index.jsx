import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminSearchForm from "@/Components/Admin/AdminSearchForm";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ToggleActive from "@/Components/Admin/ToggleActive";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaPen, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useCan } from "@/hooks/useCan";

const selectCls = "py-2 px-3 text-sm rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition";

export default function Index({ categories, filter, trashedCount = 0 }) {
    const can = useCan();
    const { data, setData, get } = useForm({ q: filter?.q || "", status: filter?.status || "" });
    const [pending, setPending] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.categories.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q, status: data.status },
        });
    };

    const deleteConfirm = (url) => {
        setPending({
            message: "Deseja realmente excluir esta categoria?",
            onConfirm: () => router.delete(url, {
                preserveScroll: true,
                onError: () => toast.error("Erro ao excluir a categoria."),
            }),
        });
    };

    return (
        <>
            <Head title="Categorias" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">
                            Categorias
                        </h2>
                        <div className="flex gap-2">
                            {can('categories.delete') && (
                                <NavButton href={route("admin.categories.trashed")} variant="secondary">
                                    Lixeira{trashedCount > 0 && ` (${trashedCount})`}
                                </NavButton>
                            )}
                            {can('categories.create') && (
                                <NavButton href={route("admin.categories.create")}>
                                    Cadastrar
                                </NavButton>
                            )}
                        </div>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <AdminSearchForm value={data.q} onChange={(v) => setData("q", v)} onSubmit={submit} placeholder="Nome da categoria...">
                                    <select value={data.status} onChange={(e) => setData("status", e.target.value)} className={selectCls}>
                                        <option value="">Qualquer status</option>
                                        <option value="1">Ativa</option>
                                        <option value="0">Inativa</option>
                                    </select>
                                </AdminSearchForm>

                                <div className="w-full">
                                    {categories.data.length > 0 ? (
                                        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Cor
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Nome
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Slug
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Ativo
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Ações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {categories.data.map(
                                                    (category) => (
                                                        <tr key={category.id}>
                                                            <td className="px-6 py-4">
                                                                <span
                                                                    className="inline-block w-6 h-6 rounded-full border border-gray-200"
                                                                    style={{
                                                                        backgroundColor:
                                                                            category.color,
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 font-medium dark:text-gray-100">
                                                                {category.name}
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                                                                {category.slug}
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <ToggleActive
                                                                    id={
                                                                        category.id
                                                                    }
                                                                    model="category"
                                                                    value={
                                                                        category.is_active
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 align-middle"><div className="flex gap-3 justify-center items-center">
                                                                {!can('categories.edit') && can('categories.view') && (
                                                                    <NavButton
                                                                        href={route("admin.categories.edit", category)}
                                                                        title="Visualizar"
                                                                    >
                                                                        <FaEye />
                                                                    </NavButton>
                                                                )}
                                                                {can('categories.edit') && (
                                                                    <NavButton
                                                                        href={route(
                                                                            "admin.categories.edit",
                                                                            category,
                                                                        )}
                                                                        title="Editar"
                                                                    >
                                                                        <FaPen />
                                                                    </NavButton>
                                                                )}
                                                                {can('categories.delete') && (
                                                                    <ActionButton
                                                                        theme="light"
                                                                        onClick={() =>
                                                                            deleteConfirm(
                                                                                route(
                                                                                    "admin.categories.destroy",
                                                                                    category,
                                                                                ),
                                                                            )
                                                                        }
                                                                    >
                                                                        <FaTrash className="text-white" />
                                                                    </ActionButton>
                                                                )}
                                                            </div></td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                            Nenhuma categoria encontrada.
                                        </div>
                                    )}
                                </div>

                                <div className="w-full">
                                    <Pagination
                                        links={categories.links}
                                        className="my-4 self-center"
                                    />
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
