import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ValidationErrors from "@/Components/Admin/ValidationErrors";
import LoadingForm from "@/Components/Admin/LoadingForm";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import ActionButton from "@/Components/Admin/ActionButton";
import NavButton from "@/Components/Admin/NavButton";
import ToggleButton from "@/Components/Admin/ToggleButton";
import ImageSlot from "@/Components/Admin/ImageSlot";
import TextareaAutosize from "react-textarea-autosize";
import RichTextEditor from "@/Components/Admin/RichTextEditor";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { CircleHelp } from "lucide-react";

export default function Form({ post = {}, categories = [] }) {
    const isEditing = !!post?.id;
    const [pending, setPending] = useState(null);

    const { data, setData, processing, errors, post: send, transform } = useForm({
        category_id:      post?.category_id      ?? "",
        title:            post?.title            ?? "",
        description:      post?.description      ?? "",
        content:          post?.content          ?? "",
        meta_title:       post?.meta_title        ?? "",
        meta_description: post?.meta_description  ?? "",
        banner_image:     null,
        is_active:        post?.is_active         ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            transform((d) => ({ ...d, _method: "PUT" }));
            send(route("admin.posts.update", post.id), {
                forceFormData: true,
                onError: () => toast.error("Verifique os campos e tente novamente."),
            });
        } else {
            send(route("admin.posts.store"), {
                forceFormData: true,
                onError: () => toast.error("Verifique os campos e tente novamente."),
            });
        }
    };

    const deleteBanner = () => {
        setPending({
            message: "Remover a imagem de capa?",
            onConfirm: () => router.delete(route("admin.image.destroy"), {
                data: { model: "post", id: post.id, field: "banner_image" },
                preserveScroll: true,
                onSuccess: () => toast.success("Imagem removida!"),
                onError:   () => toast.error("Erro ao remover imagem."),
            }),
        });
    };

    return (
        <>
            <Head title="Posts" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">
                        {isEditing ? "Editar Post" : "Criar Post"}
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="p-6">
                                <ValidationErrors errors={errors} className="mb-4" />

                                <form onSubmit={submit} className="flex flex-col gap-5">
                                    <div>
                                        <Label htmlFor="title" value="Título *" />
                                        <Input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("title", e.target.value)}
                                            disabled={processing}
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="category_id" value="Categoria" />
                                        <div className="flex items-center gap-2 mt-1">
                                            {data.category_id && (
                                                <span
                                                    className="inline-block w-4 h-4 rounded-full shrink-0 border border-gray-200"
                                                    style={{
                                                        backgroundColor: categories.find(
                                                            (c) => c.id === Number(data.category_id)
                                                        )?.color,
                                                    }}
                                                />
                                            )}
                                            <select
                                                id="category_id"
                                                value={data.category_id}
                                                onChange={(e) => setData("category_id", e.target.value)}
                                                disabled={processing}
                                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50"
                                            >
                                                <option value="">— Sem categoria —</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description" value="Descrição" />
                                        <TextareaAutosize
                                            id="description"
                                            value={data.description}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50"
                                            minRows={2}
                                            maxRows={8}
                                            onChange={(e) => setData("description", e.target.value)}
                                            disabled={processing}
                                        />
                                    </div>

                                    <div>
                                        <Label value="Conteúdo" />
                                        <div className="mt-1">
                                            <RichTextEditor
                                                value={data.content}
                                                onChange={(val) => setData("content", val)}
                                                readOnly={processing}
                                            />
                                        </div>
                                    </div>

                                    <ImageSlot
                                        label="Imagem de capa"
                                        currentUrl={post?.banner_image_url}
                                        onDelete={deleteBanner}
                                        fieldName="banner_image"
                                        onChange={setData}
                                        processing={processing}
                                    />

                                    {/* SEO */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <h2 className="text-base font-semibold dark:text-gray-100">SEO</h2>
                                            <div className="relative group">
                                                <CircleHelp size={16} className="text-gray-400 cursor-pointer" />
                                                <div className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 bg-gray-700 text-white text-sm p-2 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                                                    Campos usados para melhorar a visibilidade nos mecanismos de busca (Google etc.).
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <Label htmlFor="meta_title" value="Meta título" />
                                                <Input
                                                    id="meta_title"
                                                    type="text"
                                                    value={data.meta_title}
                                                    className="mt-1 block w-full"
                                                    placeholder={data.title || "Deixe em branco para usar o título"}
                                                    onChange={(e) => setData("meta_title", e.target.value)}
                                                    disabled={processing}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="meta_description" value="Meta descrição" />
                                                <TextareaAutosize
                                                    id="meta_description"
                                                    value={data.meta_description}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50"
                                                    minRows={2}
                                                    maxRows={8}
                                                    onChange={(e) => setData("meta_description", e.target.value)}
                                                    disabled={processing}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label value="Ativo" />
                                        <ToggleButton
                                            checked={data.is_active}
                                            onChange={(e) => setData("is_active", e.target.checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                                        {processing && <LoadingForm />}
                                        <NavButton
                                            href={route("admin.posts.index")}
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

            <ConfirmModal
                show={!!pending}
                message={pending?.message}
                onConfirm={() => { pending?.onConfirm(); setPending(null); }}
                onCancel={() => setPending(null)}
            />
        </>
    );
}
