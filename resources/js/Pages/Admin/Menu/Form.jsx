import { Head, useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ValidationErrors from "@/Components/Admin/ValidationErrors";
import LoadingForm from "@/Components/Admin/LoadingForm";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import ActionButton from "@/Components/Admin/ActionButton";
import NavButton from "@/Components/Admin/NavButton";
import ToggleButton from "@/Components/Admin/ToggleButton";

export default function Form({ item = null, roots = [] }) {
    const isEditing = !!item?.id;

    const { data, setData, processing, errors, post: send, transform } = useForm({
        label:           item?.label           ?? "",
        url:             item?.url             ?? "",
        parent_id:       item?.parent_id       ?? "",
        order:           item?.order           ?? 0,
        is_active:       item?.is_active       ?? true,
        open_in_new_tab: item?.open_in_new_tab ?? false,
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            transform((d) => ({ ...d, _method: "PUT" }));
            send(route("admin.menu.update", item.id), {
                forceFormData: true,
                onSuccess: () => toast.success("Item atualizado com sucesso!"),
                onError:   () => toast.error("Erro ao atualizar o item."),
            });
        } else {
            send(route("admin.menu.store"), {
                onSuccess: () => toast.success("Item criado com sucesso!"),
                onError:   () => toast.error("Erro ao criar o item."),
            });
        }
    };

    return (
        <>
            <Head title="Menu" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">
                        {isEditing ? "Editar Item de Menu" : "Novo Item de Menu"}
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="block p-5">
                                <ValidationErrors errors={errors} className="mb-4" />

                                <form onSubmit={submit} className="flex flex-col gap-4">
                                    <div>
                                        <Label htmlFor="label" value="Label" />
                                        <Input
                                            id="label"
                                            type="text"
                                            value={data.label}
                                            className="mt-1 block w-full"
                                            placeholder="ex: Blog, Contato, Serviços"
                                            onChange={(e) => setData("label", e.target.value)}
                                            disabled={processing}
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="url" value="URL" />
                                        <Input
                                            id="url"
                                            type="text"
                                            value={data.url}
                                            className="mt-1 block w-full font-mono"
                                            placeholder="/blog  ou  https://externo.com"
                                            onChange={(e) => setData("url", e.target.value)}
                                            disabled={processing}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="parent_id" value="Item pai (submenu)" />
                                        <select
                                            id="parent_id"
                                            value={data.parent_id}
                                            onChange={(e) => setData("parent_id", e.target.value)}
                                            disabled={processing}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50"
                                        >
                                            <option value="">— Nenhum (item raiz) —</option>
                                            {roots.map((root) => (
                                                <option key={root.id} value={root.id}>
                                                    {root.label}
                                                </option>
                                            ))}
                                        </select>
                                        {isEditing && item?.children?.length > 0 && (
                                            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                                Este item possui submenus e não pode ser transformado em submenu.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="order" value="Ordem" />
                                        <Input
                                            id="order"
                                            type="number"
                                            min="0"
                                            value={data.order}
                                            className="mt-1 block w-32"
                                            onChange={(e) => setData("order", Number(e.target.value))}
                                            disabled={processing}
                                        />
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Itens com menor número aparecem primeiro.
                                        </p>
                                    </div>

                                    <div className="flex gap-8">
                                        <div>
                                            <Label value="Ativo" />
                                            <ToggleButton
                                                checked={data.is_active}
                                                onChange={(e) => setData("is_active", e.target.checked)}
                                            />
                                        </div>
                                        <div>
                                            <Label value="Abrir em nova aba" />
                                            <ToggleButton
                                                checked={data.open_in_new_tab}
                                                onChange={(e) => setData("open_in_new_tab", e.target.checked)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end mt-2">
                                        {processing && <LoadingForm />}
                                        <NavButton
                                            href={route("admin.menu.index")}
                                            variant="secondary"
                                            className={`ml-8 ${processing ? "opacity-40" : ""}`}
                                        >
                                            Cancelar
                                        </NavButton>
                                        <ActionButton
                                            className={`ml-4 ${processing ? "opacity-40" : ""}`}
                                            disabled={processing}
                                        >
                                            Salvar
                                        </ActionButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
