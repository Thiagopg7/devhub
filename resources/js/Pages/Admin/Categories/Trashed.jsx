import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaTrash, FaUndo } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useCan } from "@/hooks/useCan";

export default function Trashed({ categories }) {
    const can = useCan();
    const [pending, setPending] = useState(null);

    const confirmRestore = (id) => setPending({
        message: "Restaurar esta categoria?",
        onConfirm: () => router.post(route("admin.categories.restore", id), {}, {
            preserveScroll: true,
            onError: () => toast.error("Erro ao restaurar a categoria."),
        }),
    });

    const confirmPurge = (id) => setPending({
        message: "Excluir permanentemente esta categoria? Esta ação não pode ser desfeita.",
        onConfirm: () => router.delete(route("admin.categories.purge", id), {
            preserveScroll: true,
            onError: () => toast.error("Erro ao excluir a categoria."),
        }),
    });

    return (
        <>
            <Head title="Lixeira — Categorias" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Lixeira — Categorias</h2>
                        <NavButton href={route("admin.categories.index")} variant="secondary">
                            Voltar
                        </NavButton>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                {categories.data.length > 0 ? (
                                    <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Cor</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Excluído por</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Excluído em</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {categories.data.map((category) => (
                                                <tr key={category.id}>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className="inline-block w-6 h-6 rounded-full border border-gray-200"
                                                            style={{ backgroundColor: category.color }}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 font-medium dark:text-gray-100">{category.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {category.deleted_by_user?.name ?? '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(category.deleted_at).toLocaleString("pt-BR")}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2 justify-end">
                                                            {can("categories.delete") && (
                                                                <>
                                                                    <ActionButton
                                                                        colorClasses="bg-green-600 text-white hover:bg-green-700"
                                                                        onClick={() => confirmRestore(category.id)}
                                                                        title="Restaurar"
                                                                    >
                                                                        <FaUndo />
                                                                    </ActionButton>
                                                                    <ActionButton
                                                                        theme="light"
                                                                        onClick={() => confirmPurge(category.id)}
                                                                        title="Excluir permanentemente"
                                                                    >
                                                                        <FaTrash className="text-white" />
                                                                    </ActionButton>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                        Nenhuma categoria na lixeira.
                                    </div>
                                )}

                                <div className="w-full mt-4">
                                    <Pagination links={categories.links} />
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
