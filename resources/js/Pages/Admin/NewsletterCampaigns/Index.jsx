import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ActionButton from "@/Components/Admin/ActionButton";
import NavButton from "@/Components/Admin/NavButton";
import Pagination from "@/Components/Admin/Pagination";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { useCan } from "@/hooks/useCan";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaTrash, FaPaperPlane, FaEye } from "react-icons/fa";
import { Mail } from "lucide-react";

const STATUS_LABEL = {
    draft:     { label: 'Rascunho',  cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
    scheduled: { label: 'Agendada',  cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    sending:   { label: 'Enviando',  cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
    sent:      { label: 'Enviada',   cls: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    failed:    { label: 'Com erro',  cls: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
};

export default function Index({ campaigns }) {
    const can = useCan();
    const [pending, setPending] = useState(null);

    const confirmSend = (campaign) => setPending({
        message: `Confirma o envio da campanha "${campaign.title}" para todos os inscritos?`,
        onConfirm: () => router.post(route('admin.newsletter-campaigns.send', campaign.id), {}, {
            preserveScroll: true,
            onError: () => toast.error('Erro ao enfileirar o envio.'),
        }),
    });

    const confirmDelete = (campaign) => setPending({
        message: `Deseja excluir a campanha "${campaign.title}"?`,
        onConfirm: () => router.delete(route('admin.newsletter-campaigns.destroy', campaign.id), {
            preserveScroll: true,
            onError: () => toast.error('Erro ao excluir a campanha.'),
        }),
    });

    return (
        <>
            <Head title="Campanhas Newsletter" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Campanhas Newsletter</h2>
                        {can('newsletter_campaigns.create') && (
                            <NavButton href={route('admin.newsletter-campaigns.create')}>
                                Nova campanha
                            </NavButton>
                        )}
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                {campaigns.data.length > 0 ? (
                                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Título</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Envios</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Criada em</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {campaigns.data.map((c) => {
                                                const s = STATUS_LABEL[c.status] ?? STATUS_LABEL.draft;
                                                return (
                                                    <tr key={c.id}>
                                                        <td className="px-6 py-4 font-medium dark:text-gray-100">
                                                            <div>{c.title}</div>
                                                            <div className="text-xs text-gray-400 font-normal">{c.subject}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${s.cls}`}>
                                                                {s.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                            {c.send_logs_count}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                            {new Date(c.created_at).toLocaleDateString('pt-BR')}
                                                        </td>
                                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                            {can('newsletter_campaigns.view') && (
                                                                <NavButton
                                                                    href={route('admin.newsletter-campaigns.show', c.id)}
                                                                    variant="secondary"
                                                                    className="!py-1.5 !px-2.5"
                                                                >
                                                                    <FaEye />
                                                                </NavButton>
                                                            )}
                                                            {can('newsletter_campaigns.edit') && (c.status === 'draft' || c.status === 'scheduled') && (
                                                                <ActionButton theme="light" onClick={() => confirmSend(c)}>
                                                                    <FaPaperPlane className="text-white" />
                                                                </ActionButton>
                                                            )}
                                                            {can('newsletter_campaigns.delete') && c.status !== 'sending' && (
                                                                <ActionButton theme="light" onClick={() => confirmDelete(c)}>
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
                                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                                        <Mail size={40} className="mx-auto mb-3 opacity-30" />
                                        <p>Nenhuma campanha criada ainda.</p>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <Pagination links={campaigns.links} />
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
