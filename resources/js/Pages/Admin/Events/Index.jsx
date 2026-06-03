import { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ToggleActive from "@/Components/Admin/ToggleActive";
import SortableTr from "@/Components/Admin/SortableTr";
import AdminSearchForm from "@/Components/Admin/AdminSearchForm";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaPen, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useCan } from "@/hooks/useCan";
import { useConfirmModal } from "@/hooks/useConfirmModal";

const STATUS_LABELS = { open: "Aberto", soon: "Em breve", full: "Lotado" };
const STATUS_COLORS = {
    open: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    soon: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    full: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function Index({ events, filter }) {
    const can = useCan();
    const { data, setData, get } = useForm({ q: filter?.q || "" });
    const [items, setItems] = useState(events.data);
    const { confirm, modalProps } = useConfirmModal();

    useEffect(() => {
        setItems(events.data);
    }, [events.data]);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.events.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q },
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        setItems(reordered);

        router.post(
            route("admin.reorder"),
            {
                model: "event",
                items: reordered.map((item, idx) => ({ id: item.id, order: idx + 1 })),
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => toast.success("Ordem atualizada!"),
                onError: () => toast.error("Erro ao salvar a ordem."),
            },
        );
    };

    const deleteConfirm = (id) => {
        confirm({
            message: "Deseja realmente excluir este evento?",
            onConfirm: () => router.delete(route("admin.events.destroy", id), {
                preserveScroll: true,
                onError: () => toast.error("Erro ao excluir o evento."),
            }),
        });
    };

    const isFiltering = !!data.q;

    return (
        <>
            <Head title="Eventos" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Eventos</h2>
                        {can("events.create") && (
                            <NavButton href={route("admin.events.create")}>Cadastrar</NavButton>
                        )}
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">

                                <AdminSearchForm value={data.q} onChange={(v) => setData("q", v)} onSubmit={submit} />

                                {items.length > 0 ? (
                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                                            <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="w-8" />
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Data</th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Título</th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Tipo</th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ativo</th>
                                                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {items.map((event) => (
                                                        <SortableTr key={event.id} id={event.id} disabled={isFiltering}>
                                                            <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                                                {event.day}/{event.month}/{event.year}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="font-medium dark:text-gray-100">{event.title}</div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{event.org}</div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                                {event.type_label}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[event.status] ?? ""}`}>
                                                                    {STATUS_LABELS[event.status] ?? event.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <ToggleActive id={event.id} model="event" value={event.is_active} />
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex gap-2 justify-end">
                                                                    {!can("events.edit") && can("events.view") && (
                                                                        <NavButton href={route("admin.events.edit", event.id)} title="Visualizar">
                                                                            <FaEye />
                                                                        </NavButton>
                                                                    )}
                                                                    {can("events.edit") && (
                                                                        <NavButton href={route("admin.events.edit", event.id)} title="Editar">
                                                                            <FaPen />
                                                                        </NavButton>
                                                                    )}
                                                                    {can("events.delete") && (
                                                                        <ActionButton theme="light" onClick={() => deleteConfirm(event.id)}>
                                                                            <FaTrash className="text-white" />
                                                                        </ActionButton>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </SortableTr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </SortableContext>
                                    </DndContext>
                                ) : (
                                    <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                        Nenhum evento encontrado.
                                    </div>
                                )}

                                <div className="w-full mt-4">
                                    <Pagination links={events.links} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <ConfirmModal {...modalProps} />
        </>
    );
}
