import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaPen, FaTrash, FaSearch, FaLock, FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useCan } from "@/hooks/useCan";

export default function Index({ roles, filter }) {
    const can = useCan();
    const { data, setData, get } = useForm({ q: filter?.q || "" });
    const [pending, setPending] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.roles.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q },
        });
    };

    const deleteConfirm = (role) => {
        setPending({
            message: `Excluir o perfil "${role.name}"?`,
            onConfirm: () => router.delete(route("admin.roles.destroy", role.id), {
                preserveScroll: true,
                onError: (errors) => toast.error(Object.values(errors)[0] ?? "Erro ao excluir."),
            }),
        });
    };

    return (
        <>
            <Head title="Perfis" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Perfis</h2>
                        {can('roles.create') && (
                            <NavButton href={route("admin.roles.create")}>Cadastrar</NavButton>
                        )}
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
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

                                {roles.data.length > 0 ? (
                                    <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Permissões</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Usuários</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {roles.data.map((role) => (
                                                <tr key={role.id}>
                                                    <td className="px-6 py-4 font-medium dark:text-gray-100">
                                                        <div className="flex items-center gap-2">
                                                            {role.name}
                                                            {role.is_system && (
                                                                <span
                                                                    title="Perfil de sistema — protegido"
                                                                    className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                                                >
                                                                    <FaLock size={10} /> Sistema
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">{role.permissions_count}</td>
                                                    <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">{role.users_count}</td>
                                                    <td className="px-6 py-4 flex gap-3 justify-end">
                                                        {!can('roles.edit') && can('roles.view') && (
                                                            <NavButton href={route("admin.roles.edit", role.id)} title="Visualizar">
                                                                <FaEye />
                                                            </NavButton>
                                                        )}
                                                        {can('roles.edit') && (
                                                            <NavButton
                                                                href={route("admin.roles.edit", role.id)}
                                                                title={role.is_system ? "Visualizar" : "Editar"}
                                                            >
                                                                <FaPen />
                                                            </NavButton>
                                                        )}
                                                        {!role.is_system && can('roles.delete') && (
                                                            <ActionButton theme="light" onClick={() => deleteConfirm(role)}>
                                                                <FaTrash className="text-white" />
                                                            </ActionButton>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                        Nenhum perfil cadastrado.
                                    </div>
                                )}

                                <div className="w-full">
                                    <Pagination links={roles.links} className="my-4 self-center" />
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
