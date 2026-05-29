import { Head, useForm, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ValidationErrors from "@/Components/Admin/ValidationErrors";
import ReadonlyBanner from "@/Components/Admin/ReadonlyBanner";
import LoadingForm from "@/Components/Admin/LoadingForm";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import ActionButton from "@/Components/Admin/ActionButton";
import NavButton from "@/Components/Admin/NavButton";
import ToggleButton from "@/Components/Admin/ToggleButton";
import ImageSlot from "@/Components/Admin/ImageSlot";
import TextareaAutosize from "react-textarea-autosize";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { useState } from "react";
import { useCan } from "@/hooks/useCan";

export default function Form({ technology = null }) {
    const can = useCan();
    const isEditing = !!technology?.id;
    const readonly = isEditing && !can('technologies.edit');
    const [pending, setPending] = useState(null);

    const { data, setData, processing, errors, post: send, transform } = useForm({
        name:             technology?.name        ?? "",
        description:      technology?.description ?? "",
        url:              technology?.url         ?? "",
        icon_image:       null,
        screenshot_image: null,
        order:            technology?.order       ?? "",
        is_active:        technology?.is_active   ?? true,
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            transform((d) => ({ ...d, _method: "PUT" }));
            send(route("admin.technologies.update", technology.id), {
                forceFormData: true,
                onError: () => toast.error("Erro ao atualizar a tecnologia."),
            });
        } else {
            send(route("admin.technologies.store"), {
                forceFormData: true,
                onError: () => toast.error("Erro ao criar a tecnologia."),
            });
        }
    };

    const deleteImage = (field) => {
        setPending({
            message: "Remover a imagem?",
            onConfirm: () => router.delete(route("admin.image.destroy"), {
                data: { model: "technology", id: technology.id, field },
                preserveScroll: true,
                onSuccess: () => toast.success("Imagem removida!"),
                onError:   () => toast.error("Erro ao remover imagem."),
            }),
        });
    };

    return (
        <>
            <Head title="Tecnologias" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">
                        {readonly ? "Visualizar Tecnologia" : isEditing ? "Editar Tecnologia" : "Nova Tecnologia"}
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="block p-5">
                                <ValidationErrors errors={errors} className="mb-4" />
                                {readonly && <ReadonlyBanner />}

                                <form onSubmit={submit} className="flex flex-col gap-4">
                                    <div>
                                        <Label htmlFor="name" value="Nome" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("name", e.target.value)}
                                            disabled={processing || readonly}
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
                                            disabled={processing || readonly}
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
                                            disabled={processing || readonly}
                                        />
                                    </div>

                                    <ImageSlot
                                        label="Ícone / Logo"
                                        currentUrl={technology?.icon_image_url}
                                        fieldName="icon_image"
                                        onChange={(field, file) => setData(field, file)}
                                        onDelete={() => deleteImage("icon_image")}
                                        processing={processing || readonly}
                                    />

                                    <ImageSlot
                                        label="Screenshot (opcional)"
                                        currentUrl={technology?.screenshot_image_url}
                                        fieldName="screenshot_image"
                                        onChange={(field, file) => setData(field, file)}
                                        onDelete={() => deleteImage("screenshot_image")}
                                        processing={processing || readonly}
                                    />

                                    <div>
                                        <Label htmlFor="order" value="Ordem" />
                                        <Input
                                            id="order"
                                            type="number"
                                            min="0"
                                            value={data.order}
                                            className="mt-1 block w-32"
                                            onChange={(e) => setData("order", e.target.value === "" ? "" : Number(e.target.value))}
                                            disabled={processing || readonly}
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
                                            disabled={readonly}
                                        />
                                    </div>

                                    <div className="flex items-center justify-end mt-2">
                                        {!readonly && processing && <LoadingForm />}
                                        <NavButton
                                            href={route("admin.technologies.index")}
                                            variant="secondary"
                                            className={`ml-8 ${processing ? "opacity-40" : ""}`}
                                        >
                                            {readonly ? "Voltar" : "Cancelar"}
                                        </NavButton>
                                        {!readonly && (
                                            <ActionButton
                                                className={`ml-4 ${processing ? "opacity-40" : ""}`}
                                                disabled={processing}
                                            >
                                                Salvar
                                            </ActionButton>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            {pending && (
                <ConfirmModal
                    message={pending.message}
                    onConfirm={() => { pending.onConfirm(); setPending(null); }}
                    onCancel={() => setPending(null)}
                />
            )}
        </>
    );
}
