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
import { useCan } from "@/hooks/useCan";

export default function Form({ area = null }) {
    const can = useCan();
    const isEditing = !!area?.id;
    const readonly = isEditing && !can('newsletter_areas.edit');

    const { data, setData, processing, errors, post: send, transform } = useForm({
        name:      area?.name      ?? "",
        order:     area?.order     ?? "",
        is_active: area?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            transform((d) => ({ ...d, _method: "PUT" }));
            send(route("admin.newsletter-areas.update", area.id), {
                onError: () => toast.error("Erro ao atualizar a área."),
            });
        } else {
            send(route("admin.newsletter-areas.store"), {
                onError: () => toast.error("Erro ao criar a área."),
            });
        }
    };

    return (
        <>
            <Head title="Áreas de Atuação" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">
                        {readonly ? "Visualizar Área de Atuação" : isEditing ? "Editar Área de Atuação" : "Nova Área de Atuação"}
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
                                            href={route("admin.newsletter-areas.index")}
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
