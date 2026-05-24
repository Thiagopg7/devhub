import { useState, useEffect, useCallback } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ToggleActive from "@/Components/Admin/ToggleActive";
import SortableTr from "@/Components/Admin/SortableTr";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaPen, FaTrash, FaSearch, FaEye } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCan } from "@/hooks/useCan";

export default function Index({ technologies, filter }) {
    const can = useCan();
    const { data, setData, get } = useForm({ q: filter?.q || "" });
    const [items, setItems] = useState(technologies.data);
    const [pending, setPending] = useState(null);

    useEffect(() => {
        setItems(technologies.data);
    }, [technologies.data]);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.technologies.index"), {
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
                model: "technology",
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
            message: "Deseja realmente excluir esta tecnologia?",
            onConfirm: () => router.delete(route("admin.technologies.destroy", id), {
                preserveScroll: true,
                onError: () => toast.error("Erro ao excluir a tecnologia."),
            }),
        });
    };

    const isFiltering = !!data.q;

    return (
        <>
            <Head title="Tecnologias" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">Tecnologias</h2>
                        {can('technologies.create') && (
                            <NavButton href={route("admin.technologies.create")}>Cadastrar</NavButton>
                        )}
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ícone</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">URL</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ativo</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {items.map((tech) => (
                                                        <SortableTr key={tech.id} id={tech.id} disabled={isFiltering}>
                                                            <td className="px-6 py-4">
                                                                {tech.icon_url ? (
                                                                    <img
                                                                        src={tech.icon_url}
                                                                        alt={tech.name}
                                                                        className="w-8 h-8 rounded object-contain bg-gray-100 dark:bg-gray-700 p-0.5"
                                                                    />
                                                                ) : (
                                                                    <span className="inline-block w-8 h-8 rounded bg-gray-100 dark:bg-gray-700" />
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 font-medium dark:text-gray-100">{tech.name}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                                <a href={tech.url} target="_blank" rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 hover:text-sky-500 transition-colors">
                                                                    {tech.url}
                                                                    <ExternalLink size={12} />
                                                                </a>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <ToggleActive id={tech.id} model="technology" value={tech.is_active} />
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex gap-2 justify-end">
                                                                    {!can('technologies.edit') && can('technologies.view') && (
                                                                        <NavButton href={route("admin.technologies.edit", tech.id)} title="Visualizar">
                                                                            <FaEye />
                                                                        </NavButton>
                                                                    )}
                                                                    {can('technologies.edit') && (
                                                                        <NavButton href={route("admin.technologies.edit", tech.id)} title="Editar">
                                                                            <FaPen />
                                                                        </NavButton>
                                                                    )}
                                                                    {can('technologies.delete') && (
                                                                        <ActionButton theme="light" onClick={() => deleteConfirm(tech.id)}>
                                                                            <FaTrash className="text-white" />
                                                                        </ActionButton>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </SortableTr>
                                                    ))}
                                                </tbody>
                                            </SortableContext>
                                        </DndContext>
                                    </table>
                                ) : (
                                    <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                        Nenhuma tecnologia encontrada.
                                    </div>
                                )}

                                <div className="w-full mt-4">
                                    <Pagination links={technologies.links} />
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
