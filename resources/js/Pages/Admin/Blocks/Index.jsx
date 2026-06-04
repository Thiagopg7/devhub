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

export default function Index({ blocks, filter }) {
    const can = useCan();
    const { data, setData, get } = useForm({
        q: filter?.q || "",
    });
    const [pending, setPending] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.blocks.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q },
        });
    };

    const deleteConfirm = (url) => {
        setPending({
            message: "Deseja realmente excluir este bloco?",
            onConfirm: () => router.delete(url, {
                preserveScroll: true,
                onError: () => toast.error("Erro ao excluir o bloco."),
            }),
        });
    };

    return (
        <>
            <Head title="Blocos" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">
                            Blocos
                        </h2>
                        {can('blocks.create') && (
                            <NavButton href={route("admin.blocks.create")}>
                                Cadastrar
                            </NavButton>
                        )}
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <AdminSearchForm value={data.q} onChange={(v) => setData("q", v)} onSubmit={submit} />

                                <div className="w-full">
                                    {blocks.data.length > 0 ? (
                                        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
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
                                                {blocks.data.map((block) => (
                                                    <tr key={block.id}>
                                                        <td className="px-6 py-4 font-medium dark:text-gray-100">
                                                            {block.name}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                                                            {block.slug}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <ToggleActive
                                                                id={block.id}
                                                                model="block"
                                                                value={
                                                                    block.is_active
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 align-middle"><div className="flex gap-3 justify-center items-center">
                                                            {!can('blocks.edit') && can('blocks.view') && (
                                                                <NavButton
                                                                    href={route("admin.blocks.edit", block)}
                                                                    title="Visualizar"
                                                                >
                                                                    <FaEye />
                                                                </NavButton>
                                                            )}
                                                            {can('blocks.edit') && (
                                                                <NavButton
                                                                    href={route(
                                                                        "admin.blocks.edit",
                                                                        block,
                                                                    )}
                                                                    title="Editar"
                                                                >
                                                                    <FaPen />
                                                                </NavButton>
                                                            )}
                                                            {can('blocks.delete') && (
                                                                <ActionButton
                                                                    theme="light"
                                                                    onClick={() =>
                                                                        deleteConfirm(
                                                                            route(
                                                                                "admin.blocks.destroy",
                                                                                block,
                                                                            ),
                                                                        )
                                                                    }
                                                                >
                                                                    <FaTrash className="text-white" />
                                                                </ActionButton>
                                                            )}
                                                        </div></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                            Nenhum bloco encontrado.
                                        </div>
                                    )}
                                </div>

                                <div className="w-full">
                                    <Pagination
                                        links={blocks.links}
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
