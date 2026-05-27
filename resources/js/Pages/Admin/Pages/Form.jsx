import { Head, useForm, router } from "@inertiajs/react";
import { useState, useRef, useCallback } from "react";
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
import RichTextEditor from "@/Components/Admin/RichTextEditor";
import ImageSlot from "@/Components/Admin/ImageSlot";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import TextareaAutosize from "react-textarea-autosize";
import { Trash2, Upload } from "lucide-react";
import { useCan } from "@/hooks/useCan";

const TABS = [
    { id: "content", label: "Conteúdo" },
    { id: "images",  label: "Imagens"  },
    { id: "seo",     label: "SEO"      },
];

function TabBar({ active, onChange }) {
    return (
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onChange(tab.id)}
                    className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                        active === tab.id
                            ? "border-red-600 text-red-600 dark:text-red-400"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

function GallerySection({ page, processing, readonly, onDeleteRequest }) {
    const { data, setData, post: uploadImages, processing: uploading, reset } = useForm({ images: [] });
    const inputRef = useRef();

    if (!page?.id) {
        return (
            <div className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-400 dark:text-gray-500">
                Salve a página primeiro para gerenciar a galeria.
            </div>
        );
    }

    const MAX_MB = 5;
    const MAX_BYTES = MAX_MB * 1024 * 1024;

    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const oversized = files.filter((f) => f.size > MAX_BYTES);
        if (oversized.length) {
            toast.error(
                `${oversized.length > 1 ? `${oversized.length} imagens ultrapassam` : "Uma imagem ultrapassa"} o limite de ${MAX_MB} MB por arquivo.`
            );
            if (inputRef.current) inputRef.current.value = "";
            return;
        }

        setData("images", files);
    };

    const submitUpload = () => {
        if (!data.images.length) return;
        uploadImages(route("admin.pages.gallery.store", page.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Imagens adicionadas!");
                reset();
                if (inputRef.current) inputRef.current.value = "";
            },
            onError: (errs) => {
                if (errs?.status === 413 || Object.keys(errs).length === 0) {
                    toast.error(`Arquivo muito grande. O limite é ${MAX_MB} MB por envio.`);
                } else {
                    toast.error("Erro ao enviar imagens.");
                }
            },
        });
    };

    const deleteImage = (imageId) => {
        onDeleteRequest({
            message: "Remover esta imagem da galeria?",
            onConfirm: () => router.delete(route("admin.gallery-images.destroy", imageId), {
                preserveScroll: true,
                onSuccess: () => toast.success("Imagem removida!"),
                onError: () => toast.error("Erro ao remover imagem."),
            }),
        });
    };

    const gallery = page.gallery_images ?? [];

    return (
        <div>
            <Label value="Galeria de imagens" />

            {gallery.length > 0 ? (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {gallery.map((img) => (
                        <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square bg-gray-100 dark:bg-gray-900">
                            <img src={img.image_url} alt="" loading="lazy" className="w-full h-full object-cover" />
                            {!readonly && (
                                <button
                                    type="button"
                                    onClick={() => deleteImage(img.id)}
                                    className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                    title="Remover"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">Nenhuma imagem na galeria.</p>
            )}

            {!readonly && (
                <div className="mt-4 flex items-center gap-3">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleUpload}
                    />
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Upload size={14} />
                        Selecionar imagens
                    </button>
                    {data.images.length > 0 && (
                        <button
                            type="button"
                            onClick={submitUpload}
                            disabled={uploading}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                            {uploading ? "Enviando..." : `Adicionar ${data.images.length} imagem(ns)`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Form({ page = null }) {
    const can = useCan();
    const isEditing = !!page?.id;
    const readonly = isEditing && !can('pages.edit');
    const [tab, setTab] = useState("content");
    const [pending, setPending] = useState(null);

    const handleDeleteRequest = useCallback((config) => setPending(config), []);

    const { data, setData, processing, errors, post: send, transform } = useForm({
        title:            page?.title            ?? "",
        subtitle:         page?.subtitle         ?? "",
        content:          page?.content          ?? "",
        banner_image:     null,
        main_image:       null,
        is_active:        page?.is_active        ?? true,
        is_searchable:    page?.is_searchable    ?? true,
        meta_title:       page?.meta_title       ?? "",
        meta_description: page?.meta_description ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            transform((d) => ({ ...d, _method: "PUT" }));
            send(route("admin.pages.update", page.id), {
                forceFormData: true,
                onError: () => toast.error("Verifique os campos e tente novamente."),
            });
        } else {
            send(route("admin.pages.store"), {
                forceFormData: true,
                onError: () => toast.error("Verifique os campos e tente novamente."),
            });
        }
    };

    const deleteImage = (field, label) => {
        setPending({
            message: `Remover ${label}?`,
            onConfirm: () => router.delete(route("admin.image.destroy"), {
                data: { model: "page", id: page.id, field },
                preserveScroll: true,
                onSuccess: () => toast.success("Imagem removida!"),
                onError:   () => toast.error("Erro ao remover imagem."),
            }),
        });
    };

    return (
        <>
            <Head title="Páginas" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">
                        {readonly ? `Visualizar: ${page.title}` : isEditing ? `Editar: ${page.title}` : "Nova Página"}
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="p-6">
                                <ValidationErrors errors={errors} className="mb-4" />
                                {readonly && <ReadonlyBanner />}

                                <TabBar active={tab} onChange={setTab} />

                                <form onSubmit={submit} className="flex flex-col gap-5">

                                    {tab === "content" && (
                                        <>
                                            <div>
                                                <Label htmlFor="title" value="Título *" />
                                                <Input
                                                    id="title"
                                                    type="text"
                                                    value={data.title}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData("title", e.target.value)}
                                                    disabled={processing || readonly}
                                                    autoFocus
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="subtitle" value="Subtítulo" />
                                                <Input
                                                    id="subtitle"
                                                    type="text"
                                                    value={data.subtitle}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData("subtitle", e.target.value)}
                                                    disabled={processing || readonly}
                                                />
                                            </div>

                                            <div>
                                                <Label value="Conteúdo" />
                                                <div className="mt-1">
                                                    <RichTextEditor
                                                        value={data.content}
                                                        onChange={(val) => setData("content", val)}
                                                        readOnly={processing || readonly}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-10 pt-2">
                                                <div>
                                                    <Label value="Ativo" />
                                                    <ToggleButton
                                                        checked={data.is_active}
                                                        onChange={(e) => setData("is_active", e.target.checked)}
                                                        disabled={readonly}
                                                    />
                                                </div>
                                                <div>
                                                    <Label value="Pesquisável" />
                                                    <ToggleButton
                                                        checked={data.is_searchable}
                                                        onChange={(e) => setData("is_searchable", e.target.checked)}
                                                        disabled={readonly}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {tab === "images" && (
                                        <>
                                            <ImageSlot
                                                label="Banner"
                                                currentUrl={page?.banner_image_url}
                                                onDelete={() => deleteImage("banner_image", "o banner")}
                                                fieldName="banner_image"
                                                onChange={setData}
                                                processing={processing || readonly}
                                            />

                                            <ImageSlot
                                                label="Imagem principal"
                                                currentUrl={page?.main_image_url}
                                                onDelete={() => deleteImage("main_image", "a imagem principal")}
                                                fieldName="main_image"
                                                onChange={setData}
                                                processing={processing || readonly}
                                            />

                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                                                <GallerySection page={page} processing={processing} readonly={readonly} onDeleteRequest={handleDeleteRequest} />
                                            </div>
                                        </>
                                    )}

                                    {tab === "seo" && (
                                        <>
                                            {isEditing && (
                                                <div>
                                                    <Label value="Slug (gerado automaticamente)" />
                                                    <p className="mt-1 font-mono text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2 border border-gray-200 dark:border-gray-700">
                                                        /{page.slug}
                                                    </p>
                                                </div>
                                            )}

                                            <div>
                                                <Label htmlFor="meta_title" value="Meta título" />
                                                <Input
                                                    id="meta_title"
                                                    type="text"
                                                    value={data.meta_title}
                                                    className="mt-1 block w-full"
                                                    placeholder={data.title || "Deixe em branco para usar o título"}
                                                    onChange={(e) => setData("meta_title", e.target.value)}
                                                    disabled={processing || readonly}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="meta_description" value="Meta descrição" />
                                                <TextareaAutosize
                                                    id="meta_description"
                                                    value={data.meta_description}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50"
                                                    minRows={3}
                                                    maxRows={6}
                                                    placeholder="Descrição para mecanismos de busca (máx. 500 caracteres)"
                                                    onChange={(e) => setData("meta_description", e.target.value)}
                                                    disabled={processing || readonly}
                                                />
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {data.meta_description?.length ?? 0}/500
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex items-center justify-end pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                        {!readonly && processing && <LoadingForm />}
                                        <NavButton
                                            href={route("admin.pages.index")}
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

            <ConfirmModal
                show={!!pending}
                message={pending?.message}
                onConfirm={() => { pending?.onConfirm(); setPending(null); }}
                onCancel={() => setPending(null)}
            />
        </>
    );
}
