import { Head, useForm } from "@inertiajs/react";
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
import TextareaAutosize from "react-textarea-autosize";
import DOMPurify from "dompurify";
import { useCan } from "@/hooks/useCan";

export default function Form({ stackItem = null }) {
    const can = useCan();
    const isEditing = !!stackItem?.id;
    const readonly = isEditing && !can('stack.edit');

    const { data, setData, processing, errors, post: send, transform } = useForm({
        name:      stackItem?.name      ?? "",
        icon:      stackItem?.icon      ?? "",
        order:     stackItem?.order     ?? "",
        is_active: stackItem?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            transform((d) => ({ ...d, _method: "PUT" }));
            send(route("admin.stack.update", stackItem.id), {
                onError: () => toast.error("Erro ao atualizar a tecnologia."),
            });
        } else {
            send(route("admin.stack.store"), {
                onError: () => toast.error("Erro ao criar a tecnologia."),
            });
        }
    };

    return (
        <>
            <Head title="Stack" />

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
                                        <Label htmlFor="icon" value="Ícone (SVG)" />
                                        <div className="flex items-start gap-3 mt-1">
                                            <span
                                                className="shrink-0 grid place-items-center w-12 h-12 rounded-md border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                                                aria-hidden="true"
                                            >
                                                <span className="w-6 h-6 block" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.icon) }} />
                                            </span>
                                            <TextareaAutosize
                                                id="icon"
                                                value={data.icon}
                                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 font-mono text-xs shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50"
                                                minRows={3}
                                                maxRows={10}
                                                onChange={(e) => setData("icon", e.target.value)}
                                                disabled={processing || readonly}
                                                placeholder='<svg viewBox="0 0 24 24" ...>...</svg>'
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Cole o markup do SVG. Use <code>stroke="currentColor"</code> ou <code>fill="currentColor"</code> para herdar a cor do tema.
                                        </p>
                                    </div>

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
                                            href={route("admin.stack.index")}
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
        </>
    );
}
