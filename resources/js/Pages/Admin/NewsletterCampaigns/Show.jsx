import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { useCan } from "@/hooks/useCan";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaPaperPlane } from "react-icons/fa";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";

const STATUS_LABEL = {
    draft:     { label: 'Rascunho',  cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
    scheduled: { label: 'Agendada',  cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    sending:   { label: 'Enviando',  cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
    sent:      { label: 'Enviada',   cls: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    failed:    { label: 'Com erro',  cls: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
};

const LOG_ICON = {
    sent:    <CheckCircle size={14} className="text-green-500" />,
    failed:  <XCircle size={14} className="text-red-500" />,
    pending: <Clock size={14} className="text-yellow-500" />,
};

export default function Show({ campaign, logs, stats }) {
    const can = useCan();
    const [pending, setPending] = useState(null);
    const s = STATUS_LABEL[campaign.status] ?? STATUS_LABEL.draft;

    const confirmSend = () => setPending({
        message: `Confirma o envio desta campanha para todos os inscritos?`,
        onConfirm: () => router.post(route('admin.newsletter-campaigns.send', campaign.id), {}, {
            preserveScroll: true,
            onError: () => toast.error('Erro ao enfileirar o envio.'),
        }),
    });

    return (
        <>
            <Head title={`Campanha: ${campaign.title}`} />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h2 className="font-semibold text-xl leading-tight">{campaign.title}</h2>
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${s.cls}`}>
                                {s.label}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {can('newsletter_campaigns.view') && (
                                <NavButton
                                    href={route('admin.newsletter-campaigns.preview', campaign.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="secondary"
                                >
                                    <Eye size={15} className="mr-1.5" /> Pré-visualizar
                                </NavButton>
                            )}
                            {can('newsletter_campaigns.edit') && (campaign.status === 'draft' || campaign.status === 'scheduled') && (
                                <ActionButton theme="light" onClick={confirmSend}>
                                    <FaPaperPlane className="text-white mr-1.5" /> Enviar agora
                                </ActionButton>
                            )}
                            <NavButton href={route('admin.newsletter-campaigns.index')} variant="secondary">
                                Voltar
                            </NavButton>
                        </div>
                    </div>
                }
            >
                <div className="py-12 space-y-6">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Total', value: stats.total, cls: 'text-gray-700 dark:text-gray-200' },
                                { label: 'Enviados', value: stats.sent, cls: 'text-green-600 dark:text-green-400' },
                                { label: 'Pendentes', value: stats.pending, cls: 'text-yellow-600 dark:text-yellow-400' },
                                { label: 'Com erro', value: stats.failed, cls: 'text-red-600 dark:text-red-400' },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                                    <div className={`text-3xl font-bold ${stat.cls}`}>{stat.value}</div>
                                    <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Posts incluídos */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Posts incluídos</h3>
                            <ul className="space-y-1">
                                {campaign.posts.map((post) => (
                                    <li key={post.id} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
                                        {post.title}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Log de envios */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-700 dark:text-gray-200">Log de envios</h3>
                            </div>
                            {logs.data.length > 0 ? (
                                <table className="w-full divide-y divide-gray-100 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Inscrito</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">E-mail</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Enviado em</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {logs.data.map((log) => (
                                            <tr key={log.id}>
                                                <td className="px-6 py-3 text-sm dark:text-gray-200">{log.subscriber?.name ?? '—'}</td>
                                                <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">{log.subscriber?.email ?? '—'}</td>
                                                <td className="px-6 py-3">
                                                    <span className="flex items-center gap-1.5 text-sm">
                                                        {LOG_ICON[log.status]}
                                                        {log.status}
                                                    </span>
                                                    {log.error && <p className="text-xs text-red-400 mt-0.5">{log.error}</p>}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-400">
                                                    {log.sent_at ? new Date(log.sent_at).toLocaleString('pt-BR') : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-10 text-sm text-gray-400">
                                    Nenhum registro de envio ainda.
                                </div>
                            )}
                            <div className="p-4">
                                <Pagination links={logs.links} />
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
