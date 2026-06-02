import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminSearchForm from "@/Components/Admin/AdminSearchForm";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaTrash } from "react-icons/fa";
import { Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCan } from "@/hooks/useCan";

export default function Index({ subscribers, filter, total }) {
    const can = useCan();
    const { data, setData, get } = useForm({ q: filter?.q || "" });
    const [pending, setPending] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.newsletter-subscribers.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q },
        });
    };

    const deleteConfirm = (id) => {
        setPending({
            message: "Deseja realmente remover este inscrito?",
            onConfirm: () => router.delete(route("admin.newsletter-subscribers.destroy", id), {
                preserveScroll: true,
                onError: () => toast.error("Erro ao remover o inscrito."),
            }),
        });
    };

    return (
        <>
            <Head title="Inscritos Newsletter" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Inscritos Newsletter</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Users size={16} />
                            <span>{total} inscrito{total !== 1 ? "s" : ""}</span>
                        </div>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">

                                <AdminSearchForm value={data.q} onChange={(v) => setData("q", v)} onSubmit={submit} placeholder="Nome ou e-mail..." />

                                {subscribers.data.length > 0 ? (
                                    <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">E-mail</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Área</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">LGPD</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Data</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {subscribers.data.map((sub) => (
                                                <tr key={sub.id}>
                                                    <td className="px-6 py-4 font-medium dark:text-gray-100">{sub.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">{sub.email}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {sub.area?.name ?? <span className="italic text-gray-300 dark:text-gray-600">—</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        {sub.lgpd_consent ? (
                                                            <span title={sub.lgpd_consent_at ? new Date(sub.lgpd_consent_at).toLocaleString("pt-BR") : ""}
                                                                  className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                                                ✓ Consentiu
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 italic">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(sub.created_at).toLocaleDateString("pt-BR")}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {can('newsletter_subscribers.delete') && (
                                                            <ActionButton theme="light" onClick={() => deleteConfirm(sub.id)}>
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
                                        Nenhum inscrito encontrado.
                                    </div>
                                )}

                                <div className="w-full mt-4">
                                    <Pagination links={subscribers.links} />
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
