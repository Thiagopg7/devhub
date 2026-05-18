import { useState } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaPen, FaTrash, FaSearch } from "react-icons/fa";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Index({ users, filter }) {
    const currentUser = usePage().props.auth.user;
    const { data, setData, get } = useForm({ q: filter?.q || "" });
    const [pending, setPending] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.users.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q },
        });
    };

    const deleteConfirm = (user) => {
        setPending({
            message: `Excluir o usuário "${user.name}"?`,
            onConfirm: () => router.delete(route("admin.users.destroy", user.id), {
                preserveScroll: true,
                onSuccess: () => toast.success("Usuário excluído!"),
                onError:   (errors) => toast.error(Object.values(errors)[0] ?? "Erro ao excluir."),
            }),
        });
    };

    return (
        <>
            <Head title="Usuários" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Usuários</h2>
                        <NavButton href={route("admin.users.create")}>Cadastrar</NavButton>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
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
                                                placeholder="Nome ou e-mail"
                                                className="border-gray-300 focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50 mt-1 block w-full"
                                            />
                                            <button type="submit" className="bg-red-600 py-2 px-4 rounded-md text-white">
                                                <FaSearch />
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {users.data.length > 0 ? (
                                    <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">E-mail</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Perfil</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {users.data.map((user) => {
                                                const role = user.roles?.[0];
                                                const isSelf = user.id === currentUser.id;

                                                return (
                                                    <tr key={user.id}>
                                                        <td className="px-6 py-4 font-medium dark:text-gray-100">
                                                            <div className="flex items-center gap-2">
                                                                {user.name}
                                                                {user.is_super_admin && (
                                                                    <span title="Super admin" className="inline-flex items-center text-amber-500">
                                                                        <ShieldCheck size={16} />
                                                                    </span>
                                                                )}
                                                                {isSelf && (
                                                                    <span className="text-xs text-gray-400">(você)</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                                        <td className="px-6 py-4">
                                                            {role ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
                                                                    {role.name}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-400">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 flex gap-3 justify-end">
                                                            <NavButton href={route("admin.users.edit", user.id)} title="Editar">
                                                                <FaPen />
                                                            </NavButton>
                                                            {!isSelf && (
                                                                <ActionButton theme="light" onClick={() => deleteConfirm(user)}>
                                                                    <FaTrash className="text-white" />
                                                                </ActionButton>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                        Nenhum usuário encontrado.
                                    </div>
                                )}

                                <div className="w-full">
                                    <Pagination links={users.links} className="my-4 self-center" />
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
