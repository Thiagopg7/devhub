import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import ToggleActive from "@/Components/Admin/ToggleActive";
import SortableTr from "@/Components/Admin/SortableTr";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import { FaPen, FaTrash, FaSearch } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";

function MenuRowCells({ item, isChild = false }) {
    const deleteConfirm = (id) => {
        if (confirm("Deseja realmente excluir este item?")) {
            router.delete(route("admin.menu.destroy", id), {
                preserveScroll: true,
                onSuccess: () => toast.success("Item excluído com sucesso!"),
                onError: (errors) => toast.error(Object.values(errors)[0] ?? "Erro ao excluir."),
            });
        }
    };

    return (
        <>
            <td className="px-6 py-3">
                {isChild && <span className="inline-block w-4 mr-1 text-gray-400">↳</span>}
                <span className={`font-medium dark:text-gray-100 ${isChild ? "text-sm text-gray-600 dark:text-gray-300" : ""}`}>
                    {item.label}
                </span>
            </td>
            <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                {item.url}
            </td>
            <td className="px-6 py-3 text-center">
                {item.open_in_new_tab ? (
                    <ExternalLink size={16} className="mx-auto text-sky-400" title="Abre em nova aba" />
                ) : (
                    <span className="text-gray-300 dark:text-gray-600">—</span>
                )}
            </td>
            <td className="px-6 py-3 text-center">
                <ToggleActive id={item.id} model="menu_item" value={item.is_active} />
            </td>
            <td className="px-6 py-3 text-right">
                <div className="flex gap-2 justify-end">
                    <NavButton href={route("admin.menu.edit", item.id)} title="Editar">
                        <FaPen />
                    </NavButton>
                    <ActionButton theme="light" onClick={() => deleteConfirm(item.id)}>
                        <FaTrash className="text-white" />
                    </ActionButton>
                </div>
            </td>
        </>
    );
}

export default function Index({ items: initialItems, filter }) {
    const { data, setData, get } = useForm({ q: filter?.q || "" });
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.menu.index"), {
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
                model: "menu_item",
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

    const isFiltering = !!data.q;

    return (
        <>
            <Head title="Menu" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Menu</h2>
                        <NavButton href={route("admin.menu.create")}>Cadastrar</NavButton>
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

                                {items.length > 0 ? (
                                    <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="w-8" />
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Label</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">URL</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Nova aba</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ativo</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {items.map((item) => (
                                                        <React.Fragment key={item.id}>
                                                            <SortableTr id={item.id} disabled={isFiltering}>
                                                                <MenuRowCells item={item} />
                                                            </SortableTr>
                                                            {item.children?.map((child) => (
                                                                <tr key={child.id} className="bg-gray-50 dark:bg-gray-750">
                                                                    <td className="pl-3 pr-1 py-4 w-8" />
                                                                    <MenuRowCells item={child} isChild />
                                                                </tr>
                                                            ))}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </SortableContext>
                                        </DndContext>
                                    </table>
                                ) : (
                                    <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                        Nenhum item de menu cadastrado.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
