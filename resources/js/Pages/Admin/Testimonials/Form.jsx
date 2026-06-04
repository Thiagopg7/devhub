import { Head, useForm, router } from "@inertiajs/react";
import { useConfirmModal } from "@/hooks/useConfirmModal";
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
import { useCan } from "@/hooks/useCan";

export default function Form({ testimonial = null }) {
    const can = useCan();
    const isEditing = !!testimonial?.id;
    const readonly = isEditing && !can('testimonials.edit');
    const { confirm, modalProps } = useConfirmModal();

    const { data, setData, processing, errors, post: send, transform } = useForm({
        name:         testimonial?.name        ?? "",
        role:         testimonial?.role        ?? "",
        company:      testimonial?.company     ?? "",
        content:      testimonial?.content     ?? "",
        avatar_image: null,
        order:        testimonial?.order       ?? "",
        is_active:    testimonial?.is_active   ?? true,
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            transform((d) => ({ ...d, _method: "PUT" }));
            send(route("admin.testimonials.update", testimonial.id), {
                forceFormData: true,
                onError: () => toast.error("Erro ao atualizar o depoimento."),
            });
        } else {
            send(route("admin.testimonials.store"), {
                forceFormData: true,
                onError: () => toast.error("Erro ao criar o depoimento."),
            });
        }
    };

    const deleteImage = () => {
        confirm({
            message: "Remover o avatar?",
            onConfirm: () => router.delete(route("admin.image.destroy"), {
                data: { model: "testimonial", id: testimonial.id, field: "avatar_image" },
                preserveScroll: true,
                onSuccess: () => toast.success("Avatar removido!"),
                onError:   () => toast.error("Erro ao remover o avatar."),
            }),
        });
    };

    return (
        <>
            <Head title="Depoimentos" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">
                        {readonly ? "Visualizar Depoimento" : isEditing ? "Editar Depoimento" : "Novo Depoimento"}
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="role" value="Cargo" />
                                            <Input
                                                id="role"
                                                type="text"
                                                value={data.role}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("role", e.target.value)}
                                                disabled={processing || readonly}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="company" value="Empresa (opcional)" />
                                            <Input
                                                id="company"
                                                type="text"
                                                value={data.company}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("company", e.target.value)}
                                                disabled={processing || readonly}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="content" value="Depoimento" />
                                        <TextareaAutosize
                                            id="content"
                                            value={data.content}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50"
                                            minRows={3}
                                            maxRows={8}
                                            onChange={(e) => setData("content", e.target.value)}
                                            disabled={processing || readonly}
                                        />
                                    </div>

                                    <ImageSlot
                                        label="Avatar (opcional)"
                                        currentUrl={testimonial?.avatar_image_url}
                                        fieldName="avatar_image"
                                        onChange={(field, file) => setData(field, file)}
                                        onDelete={deleteImage}
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
                                            href={route("admin.testimonials.index")}
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

            <ConfirmModal {...modalProps} />
        </>
    );
}
