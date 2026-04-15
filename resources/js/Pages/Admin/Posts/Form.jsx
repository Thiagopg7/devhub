import { Head, useForm, Link } from "@inertiajs/react";
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
import RichTextEditor from "@/Components/Admin/RichTextEditor";
import { CircleHelp } from "lucide-react";

export default function Form({ post = {} }) {
    const {
        data,
        setData,
        processing,
        errors,
        post: send,
        transform,
    } = useForm({
        id: post?.id ?? "",
        title: post?.title ?? "",
        content: post?.content ?? "",
        meta_title: post?.meta_title ?? "",
        meta_description: post?.meta_description ?? "",
        banner_image: null,
        is_active: post?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();

        const isEditing = !!post?.id;

        const request = isEditing
            ? send(
                  route("admin.posts.update", post.id),
                  transform((data) => {
                      return {
                          ...data,
                          _method: "PUT", // método spoofing manual
                      };
                  }),
                  {
                      forceFormData: true,
                      onSuccess: () => {
                          toast.success("Post atualizado com sucesso!");
                      },
                      onError: () => {
                          toast.error("Erro ao atualizar o Post.");
                      },
                  },
              )
            : send(route("admin.posts.store"), data, {
                  forceFormData: true,
                  onSuccess: () => {
                      toast.success("Post criado com sucesso!");
                  },
                  onError: () => {
                      toast.error("Erro ao criar o Post.");
                  },
              });

        return request;
    };

    return (
        <>
            <Head title="Posts" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">
                            {data.id ? "Editar Post" : "Criar Post"}
                        </h2>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="block p-5">
                                <ValidationErrors
                                    errors={errors}
                                    className="mb-4"
                                />

                                <form
                                    onSubmit={submit}
                                    className="flex flex-col gap-4"
                                >
                                    <div>
                                        <Label htmlFor="name" value="Nome" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            disabled={processing}
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <div className="relative flex items-center gap-2">
                                            <h2 className="text-lg font-semibold">
                                                Tags SEO (Otimização para
                                                Mecanismos de Busca)
                                            </h2>
                                            <div className="relative group">
                                                <span className="text-black text-xl font-bold cursor-pointer">
                                                    <CircleHelp />
                                                </span>
                                                <div className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 bg-gray-700 text-white text-sm p-2 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                                                    SEO, ou Otimização para
                                                    Motores de Busca, é o
                                                    conjunto de práticas usadas
                                                    para melhorar a visibilidade
                                                    de um site nos resultados de
                                                    busca orgânica, como os do
                                                    Google.
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="meta_title"
                                                value="Meta Title"
                                            />
                                            <Input
                                                id="meta_title"
                                                type="text"
                                                value={data.meta_title}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "meta_title",
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={processing}
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <Label
                                                htmlFor="meta_description"
                                                value="Meta Description"
                                            />
                                            <TextareaAutosize
                                                id="meta_description"
                                                value={data.meta_description}
                                                className="mt-1 block w-full"
                                                minRows={3}
                                                maxRows={8}
                                                onChange={(e) =>
                                                    setData(
                                                        "meta_description",
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={processing}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <RichTextEditor
                                            label="Conteúdo do Post"
                                            value={data.content}
                                            onChange={(content) =>
                                                setData("content", content)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="banner_image"
                                            value="Imagem de capa"
                                        />
                                        <Input
                                            id="banner_image"
                                            type="file"
                                            accept="image/*"
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "banner_image",
                                                    e.target.files[0],
                                                )
                                            }
                                            disabled={processing}
                                        />
                                        <div>
                                            {post.banner_image && (
                                                <img
                                                    src={`/storage/${post.banner_image}`}
                                                    alt="Imagem de capa"
                                                    className="max-h-50 max-w-36 bg-slate-200"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-1/3">
                                            <Label value="Ativo" />
                                            <ToggleButton
                                                checked={data.is_active}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_active",
                                                        e.target.checked,
                                                    )
                                                }
                                                // labelOn="Ativo"
                                                // labelOff="Inativo"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end mt-2">
                                        {processing && <LoadingForm />}

                                        <NavButton
                                            href={route("admin.posts.index")}
                                            className={`ml-8 bg-gray-50 text-grey-800 rounded-md ${
                                                processing ? "opacity-40" : ""
                                            }`}
                                        >
                                            Cancelar
                                        </NavButton>

                                        <ActionButton
                                            className={`ml-4 ${
                                                processing ? "opacity-40" : ""
                                            }`}
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
