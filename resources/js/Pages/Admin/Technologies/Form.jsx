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
import TextareaAutosize from "react-textarea-autosize";

export default function Form({ technology = null }) {
    const isEditing = !!technology?.id;

    const { data, setData, processing, errors, post: send, transform } = useForm({
        name:           technology?.name           ?? "",
        description:    technology?.description    ?? "",
        url:            technology?.url            ?? "",
        icon_url:       technology?.icon_url       ?? "",
        screenshot_url: technology?.screenshot_url ?? "",
        order:          technology?.order          ?? 0,
        is_active:      technology?.is_active      ?? true,
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            transform((d) => ({ ...d, _method: "PUT" }));
            send(route("admin.technologies.update", technology.id), {
                forceFormData: true,
                onSuccess: () => toast.success("Tecnologia atualizada com sucesso!"),
                onError:   () => toast.error("Erro ao atualizar a tecnologia."),
            });
        } else {
            send(route("admin.technologies.store"), {
                onSuccess: () => toast.success("Tecnologia criada com sucesso!"),
                onError:   () => toast.error("Erro ao criar a tecnologia."),
            });
        }
    };

    return (
        <>
            <Head title="Tecnologias" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">
                        {isEditing ? "Editar Tecnologia" : "Nova Tecnologia"}
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
                                        <Label htmlFor="name" value="Nome" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("name", e.target.value)}
                                            disabled={processing}
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="description" value="Descrição" />
                                        <TextareaAutosize
                                            id="description"
                                            value={data.description}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50"
                                            minRows={2}
                                            maxRows={6}
                                            onChange={(e) => setData("description", e.target.value)}
                                            disabled={processing}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="url" value="URL da tecnologia" />
                                        <Input
                                            id="url"
                                            type="url"
                                            value={data.url}
                                            className="mt-1 block w-full font-mono"
                                            placeholder="https://exemplo.com"
                                            onChange={(e) => setData("url", e.target.value)}
                                            disabled={processing}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="icon_url" value="URL do ícone / logo" />
                                        <Input
                                            id="icon_url"
                                            type="url"
                                            value={data.icon_url}
                                            className="mt-1 block w-full font-mono"
                                            placeholder="https://exemplo.com/icon.png"
                                            onChange={(e) => setData("icon_url", e.target.value)}
                                            disabled={processing}
                                        />
                                        {data.icon_url && (
                                            <img
                                                src={data.icon_url}
                                                alt="preview"
                                                className="mt-2 w-10 h-10 rounded object-contain bg-gray-100 dark:bg-gray-700 p-0.5"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="screenshot_url" value="URL do screenshot (opcional)" />
                                        <Input
                                            id="screenshot_url"
                                            type="url"
                                            value={data.screenshot_url}
                                            className="mt-1 block w-full font-mono"
                                            placeholder="https://exemplo.com/screenshot.png"
                                            onChange={(e) => setData("screenshot_url", e.target.value)}
                                            disabled={processing}
                                        />
                                        {data.screenshot_url && (
                                            <img
                                                src={data.screenshot_url}
                                                alt="preview"
                                                className="mt-2 w-full max-h-32 object-cover rounded"
                                            />
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

                                    <div>
                                        <Label value="Ativo" />
                                        <ToggleButton
                                            checked={data.is_active}
                                            onChange={(e) => setData("is_active", e.target.checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-end mt-2">
                                        {processing && <LoadingForm />}
                                        <NavButton
                                            href={route("admin.technologies.index")}
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
