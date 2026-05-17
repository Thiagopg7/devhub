import { Head, useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ValidationErrors from "@/Components/Admin/ValidationErrors";
import LoadingForm from "@/Components/Admin/LoadingForm";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import ActionButton from "@/Components/Admin/ActionButton";
import NavButton from "@/Components/Admin/NavButton";
import TextareaAutosize from "react-textarea-autosize";

const GROUPS = ["general", "contact", "social", "seo", "tracking", "footer"];

export default function Form({ config = {} }) {
    const isEditing = !!config?.key;

    const { data, setData, processing, errors, post: send, transform } = useForm({
        key:   config?.key   ?? "",
        group: config?.group ?? "general",
        value: config?.value ?? "",
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            send(
                route("admin.configs.update", config.key),
                transform((d) => ({ ...d, _method: "PUT" })),
                {
                    forceFormData: true,
                    onSuccess: () => toast.success("Configuração atualizada com sucesso!"),
                    onError:   () => toast.error("Erro ao atualizar a configuração."),
                },
            );
        } else {
            send(route("admin.configs.store"), data, {
                onSuccess: () => toast.success("Configuração criada com sucesso!"),
                onError:   () => toast.error("Erro ao criar a configuração."),
            });
        }
    };

    return (
        <>
            <Head title="Configurações" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">
                            {isEditing ? "Editar Configuração" : "Nova Configuração"}
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
                                        <Label htmlFor="key" value="Chave" />
                                        {isEditing ? (
                                            <p className="mt-1 font-mono text-sm px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                {data.key}
                                            </p>
                                        ) : (
                                            <>
                                                <Input
                                                    id="key"
                                                    type="text"
                                                    value={data.key}
                                                    className="mt-1 block w-full font-mono"
                                                    placeholder="ex: contact_email"
                                                    onChange={(e) => setData("key", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
                                                    disabled={processing}
                                                    autoFocus
                                                />
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    Apenas letras minúsculas, números e underscore. Não pode ser alterado após criação.
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="group" value="Grupo" />
                                        <Input
                                            id="group"
                                            type="text"
                                            list="group-suggestions"
                                            value={data.group}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("group", e.target.value)}
                                            disabled={processing}
                                        />
                                        <datalist id="group-suggestions">
                                            {GROUPS.map((g) => (
                                                <option key={g} value={g} />
                                            ))}
                                        </datalist>
                                    </div>

                                    <div>
                                        <Label htmlFor="value" value="Valor" />
                                        <TextareaAutosize
                                            id="value"
                                            value={data.value}
                                            className="mt-1 block w-full font-mono text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50"
                                            minRows={3}
                                            maxRows={12}
                                            onChange={(e) => setData("value", e.target.value)}
                                            disabled={processing}
                                            placeholder={'Texto simples  ou  JSON: {"url": "https://..."}'}
                                        />
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Strings simples são aceitas diretamente. Para arrays ou objetos, use JSON válido.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end mt-2">
                                        {processing && <LoadingForm />}

                                        <NavButton
                                            href={route("admin.configs.index")}
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
