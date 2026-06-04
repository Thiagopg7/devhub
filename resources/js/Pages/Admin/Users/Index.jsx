import { useState } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { useCan } from "@/hooks/useCan";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminSearchForm from "@/Components/Admin/AdminSearchForm";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaPen, FaTrash, FaEye } from "react-icons/fa";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

const selectCls = "py-2 px-3 text-sm rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition";

export default function Index({ users, filter, roles = [] }) {
    const can = useCan();
    const currentUser = usePage().props.auth.user;
    const isSuperAdmin = usePage().props.auth.isSuperAdmin;
    const { data, setData, get } = useForm({ q: filter?.q || "", role: filter?.role || "" });
    const [pending, setPending] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.users.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q, role: data.role },
        });
    };

    const deleteConfirm = (user) => {
        setPending({
            message: `Excluir o usuário "${user.name}"?`,
            onConfirm: () => router.delete(route("admin.users.destroy", user.id), {
                preserveScroll: true,
                onError: (errors) => toast.error(Object.values(errors)[0] ?? "Erro ao excluir."),
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
                        {can('users.create') && (
                            <NavButton href={route("admin.users.create")}>Cadastrar</NavButton>
                        )}
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <AdminSearchForm value={data.q} onChange={(v) => setData("q", v)} onSubmit={submit} placeholder="Nome ou e-mail...">
                                    <select value={data.role} onChange={(e) => setData("role", e.target.value)} className={selectCls}>
                                        <option value="">Todos os perfis</option>
                                        {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </AdminSearchForm>

                                {users.data.length > 0 ? (
                                    <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">E-mail</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Perfil</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {users.data.map((user) => {
                                                const role = user.roles?.[0];
                                                const isSelf = user.id === currentUser.id;
                                                // Usuário privilegiado só pode ser gerenciado por um super admin.
                                                const isPrivileged = user.is_super_admin
                                                    || (user.roles ?? []).some((r) => r.is_system);
                                                const canManage = isSuperAdmin || !isPrivileged;

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
                                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                            {role ? (
                                                                <span className="">
                                                                    {role.name}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-400">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 align-middle"><div className="flex gap-3 justify-center items-center">
                                                            {canManage ? (
                                                                <>
                                                                    {!can('users.edit') && can('users.view') && (
                                                                        <NavButton href={route("admin.users.edit", user.id)} title="Visualizar">
                                                                            <FaEye />
                                                                        </NavButton>
                                                                    )}
                                                                    {can('users.edit') && (
                                                                        <NavButton href={route("admin.users.edit", user.id)} title="Editar">
                                                                            <FaPen />
                                                                        </NavButton>
                                                                    )}
                                                                    {!isSelf && can('users.delete') && (
                                                                        <ActionButton theme="light" onClick={() => deleteConfirm(user)}>
                                                                            <FaTrash className="text-white" />
                                                                        </ActionButton>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 dark:text-gray-500 italic">Protegido</span>
                                                            )}
                                                        </div></td>
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
