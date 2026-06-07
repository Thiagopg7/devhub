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

const selectCls = "py-2 px-3 text-sm rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition";

export default function Index({ testimonials, filter }) {
    const can = useCan();
    const { data, setData, get } = useForm({ q: filter?.q || "", status: filter?.status || "" });
    const [items, setItems] = useState(testimonials.data);
    const { confirm, modalProps } = useConfirmModal();

    useEffect(() => {
        setItems(testimonials.data);
    }, [testimonials.data]);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.testimonials.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q, status: data.status },
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
                model: "testimonial",
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
            message: "Deseja realmente excluir este depoimento?",
            onConfirm: () => router.delete(route("admin.testimonials.destroy", id), {
                preserveScroll: true,
                onError: () => toast.error("Erro ao excluir o depoimento."),
            }),
        });
    };

    const isFiltering = !!data.q || !!data.status;

    return (
        <>
            <Head title="Depoimentos" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Depoimentos</h2>
                        {can('testimonials.create') && (
                            <NavButton href={route("admin.testimonials.create")}>Cadastrar</NavButton>
                        )}
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">

                                <AdminSearchForm value={data.q} onChange={(v) => setData("q", v)} onSubmit={submit} placeholder="Nome ou empresa...">
                                    <select value={data.status} onChange={(e) => setData("status", e.target.value)} className={selectCls}>
                                        <option value="">Qualquer status</option>
                                        <option value="1">Ativo</option>
                                        <option value="0">Inativo</option>
                                    </select>
                                </AdminSearchForm>

                                {items.length > 0 ? (
                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                                            <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="w-8" />
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Avatar</th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Cargo / Empresa</th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Depoimento</th>
                                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ativo</th>
                                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {items.map((testimonial) => (
                                                        <SortableTr key={testimonial.id} id={testimonial.id} disabled={isFiltering}>
                                                            <td className="px-6 py-4">
                                                                {testimonial.avatar_image_url ? (
                                                                    <img
                                                                        src={testimonial.avatar_image_url}
                                                                        alt={testimonial.name}
                                                                        className="w-10 h-10 rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <span className="inline-block w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700" />
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 font-medium dark:text-gray-100">{testimonial.name}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                {testimonial.role}
                                                                {testimonial.company && (
                                                                    <span className="block text-xs">{testimonial.company}</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                                {testimonial.content}
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <ToggleActive id={testimonial.id} model="testimonial" value={testimonial.is_active} />
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="flex gap-2 justify-center">
                                                                    {!can('testimonials.edit') && can('testimonials.view') && (
                                                                        <NavButton href={route("admin.testimonials.edit", testimonial.id)} title="Visualizar">
                                                                            <FaEye />
                                                                        </NavButton>
                                                                    )}
                                                                    {can('testimonials.edit') && (
                                                                        <NavButton href={route("admin.testimonials.edit", testimonial.id)} title="Editar">
                                                                            <FaPen />
                                                                        </NavButton>
                                                                    )}
                                                                    {can('testimonials.delete') && (
                                                                        <ActionButton theme="light" onClick={() => deleteConfirm(testimonial.id)}>
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
                                        Nenhum depoimento encontrado.
                                    </div>
                                )}

                                <div className="w-full mt-4">
                                    <Pagination links={testimonials.links} />
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
