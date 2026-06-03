import { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminSearchForm from "@/Components/Admin/AdminSearchForm";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ToggleActive from "@/Components/Admin/ToggleActive";
import SortableTr from "@/Components/Admin/SortableTr";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaPen, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useCan } from "@/hooks/useCan";

export default function Index({ areas, filter }) {
    const can = useCan();
    const { data, setData, get } = useForm({ q: filter?.q || "" });
    const [items, setItems] = useState(areas.data);
    const [pending, setPending] = useState(null);

    useEffect(() => {
        setItems(areas.data);
    }, [areas.data]);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.newsletter-areas.index"), {
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
                model: "newsletter_area",
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
        setPending({
            message: "Deseja realmente excluir esta área?",
            onConfirm: () => router.delete(route("admin.newsletter-areas.destroy", id), {
                preserveScroll: true,
                onError: () => toast.error("Erro ao excluir a área."),
            }),
        });
    };

    const isFiltering = !!data.q;

    return (
        <>
            <Head title="Áreas de Atuação" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Áreas de Atuação</h2>
                        {can('newsletter_areas.create') && (
                            <NavButton href={route("admin.newsletter-areas.create")}>Cadastrar</NavButton>
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
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ativo</th>
                                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {items.map((area) => (
                                                        <SortableTr key={area.id} id={area.id} disabled={isFiltering}>
                                                            <td className="px-6 py-4 font-medium dark:text-gray-100">{area.name}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <ToggleActive id={area.id} model="newsletter_area" value={area.is_active} />
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="flex gap-2 justify-center">
                                                                    {!can('newsletter_areas.edit') && can('newsletter_areas.view') && (
                                                                        <NavButton href={route("admin.newsletter-areas.edit", area.id)} title="Visualizar">
                                                                            <FaEye />
                                                                        </NavButton>
                                                                    )}
                                                                    {can('newsletter_areas.edit') && (
                                                                        <NavButton href={route("admin.newsletter-areas.edit", area.id)} title="Editar">
                                                                            <FaPen />
                                                                        </NavButton>
                                                                    )}
                                                                    {can('newsletter_areas.delete') && (
                                                                        <ActionButton theme="light" onClick={() => deleteConfirm(area.id)}>
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
                                        Nenhuma área de atuação cadastrada.
                                    </div>
                                )}

                                <div className="w-full mt-4">
                                    <Pagination links={areas.links} />
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
