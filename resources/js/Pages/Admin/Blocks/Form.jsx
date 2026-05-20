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

export default function Form({ block = {} }) {
    const {
        data,
        setData,
        processing,
        errors,
        post: send,
        transform,
    } = useForm({
        id:        block?.id ?? "",
        name:      block?.name ?? "",
        content:   block?.content ?? "",
        is_active: block?.is_active ?? true,
    });

    const isEditing = !!block?.id;

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            send(
                route("admin.blocks.update", block.id),
                transform((d) => ({ ...d, _method: "PUT" })),
                {
                    onError: () => toast.error("Erro ao atualizar o bloco."),
                },
            );
        } else {
            send(route("admin.blocks.store"), data, {
                onError: () => toast.error("Erro ao criar o bloco."),
            });
        }
    };

    return (
        <>
            <Head title="Blocos" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">
                            {isEditing ? "Editar Bloco" : "Criar Bloco"}
                        </h2>
                    </div>
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
                                        <Label htmlFor="content" value="Conteúdo" />
                                        <TextareaAutosize
                                            id="content"
                                            value={data.content}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm font-mono text-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50"
                                            minRows={6}
                                            maxRows={24}
                                            onChange={(e) => setData("content", e.target.value)}
                                            disabled={processing}
                                        />
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
                                            href={route("admin.blocks.index")}
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
