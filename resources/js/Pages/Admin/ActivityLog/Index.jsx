import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Admin/Input';
import Label from '@/Components/Admin/Label';
import Pagination from '@/Components/Admin/Pagination';
import { FaSearch, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import ChangesDiff from './ChangesDiff';

const EVENT_COLORS = {
    created:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    updated:  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    deleted:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    restored: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
};

function EventBadge({ event, label }) {
    const cls = EVENT_COLORS[event] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    return (
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
}

export default function Index({ items, filters, logNames, causers, events, perPageOptions }) {
    const [expanded, setExpanded] = useState(null);
    const [form, setForm] = useState({
        log_name:  filters.log_name  ?? '',
        event:     filters.event     ?? '',
        causer_id: filters.causer_id ?? '',
        date_from: filters.date_from ?? '',
        date_to:   filters.date_to   ?? '',
        search:    filters.search    ?? '',
        per_page:  filters.per_page  ?? 25,
    });

    const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const submit = (e) => {
        e.preventDefault();
        router.get(route('admin.activity-log.index'), form, { preserveState: true, preserveScroll: true });
    };

    const reset = () => {
        const empty = { log_name: '', event: '', causer_id: '', date_from: '', date_to: '', search: '', per_page: 25 };
        setForm(empty);
        router.get(route('admin.activity-log.index'), empty, { preserveState: true, preserveScroll: true });
    };

    const toggleRow = (id) => setExpanded((prev) => (prev === id ? null : id));

    return (
        <>
            <Head title="Logs de atividade" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">Logs de atividade</h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">

                                {/* Filtros */}
                                <form onSubmit={submit} className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <Label value="Módulo" />
                                        <select
                                            value={form.log_name}
                                            onChange={(e) => setField('log_name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                                        >
                                            <option value="">Todos</option>
                                            {logNames.map((n) => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label value="Evento" />
                                        <select
                                            value={form.event}
                                            onChange={(e) => setField('event', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                                        >
                                            <option value="">Todos</option>
                                            {events.map((ev) => (
                                                <option key={ev.value} value={ev.value}>{ev.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label value="Usuário" />
                                        <select
                                            value={form.causer_id}
                                            onChange={(e) => setField('causer_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                                        >
                                            <option value="">Todos</option>
                                            {causers.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label value="Data início" />
                                        <Input
                                            type="date"
                                            value={form.date_from}
                                            onChange={(e) => setField('date_from', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                    </div>

                                    <div>
                                        <Label value="Data fim" />
                                        <Input
                                            type="date"
                                            value={form.date_to}
                                            onChange={(e) => setField('date_to', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                    </div>

                                    <div>
                                        <Label value="Busca" />
                                        <div className="flex gap-2 mt-1">
                                            <Input
                                                type="text"
                                                value={form.search}
                                                onChange={(e) => setField('search', e.target.value)}
                                                placeholder="Descrição, módulo, usuário..."
                                                className="block w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <Label value="Por página" className="whitespace-nowrap" />
                                            <select
                                                value={form.per_page}
                                                onChange={(e) => setField('per_page', Number(e.target.value))}
                                                className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                                            >
                                                {perPageOptions.map((n) => (
                                                    <option key={n} value={n}>{n}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={reset}
                                                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                Limpar
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                                            >
                                                <FaSearch />
                                                Filtrar
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Tabela */}
                                {items.data.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="w-8 px-3 py-3" />
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Módulo</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Evento</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registro</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuário</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {items.data.map((log) => (
                                                    <>
                                                        <tr
                                                            key={log.id}
                                                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                            onClick={() => toggleRow(log.id)}
                                                        >
                                                            <td className="px-3 py-3 text-gray-400">
                                                                {expanded === log.id
                                                                    ? <FaChevronDown className="text-xs" />
                                                                    : <FaChevronRight className="text-xs" />
                                                                }
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                                {new Date(log.created_at).toLocaleString('pt-BR')}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-mono dark:text-gray-200">
                                                                {log.log_name}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <EventBadge event={log.event} label={log.event_label} />
                                                            </td>
                                                            <td className="px-4 py-3 text-sm dark:text-gray-200">
                                                                {log.subject ? (
                                                                    <span>
                                                                        <span className="font-medium">{log.subject.type}</span>
                                                                        {log.subject.title && (
                                                                            <span className="text-gray-500 dark:text-gray-400"> — {log.subject.title}</span>
                                                                        )}
                                                                        <span className="text-gray-400 text-xs ml-1">(#{log.subject.id})</span>
                                                                    </span>
                                                                ) : '—'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm dark:text-gray-200">
                                                                {log.causer?.name ?? '—'}
                                                            </td>
                                                        </tr>
                                                        {expanded === log.id && (
                                                            <tr key={`${log.id}-diff`} className="bg-gray-50 dark:bg-gray-900/30">
                                                                <td colSpan={6} className="px-6 py-4">
                                                                    <ChangesDiff changes={log.changes} />
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-sm text-gray-500 dark:text-gray-400">
                                        Nenhum log encontrado.
                                    </div>
                                )}

                                <Pagination links={items.links} className="mt-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
