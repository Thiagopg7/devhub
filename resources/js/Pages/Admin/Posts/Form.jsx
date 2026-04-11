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

export default function Form({ post = {} }) {

    const { data, setData, processing, errors, post: send, transform } = useForm(
        {
            id: post?.id ?? "",
            name: post?.name ?? "",
            icon: null,
            is_active: post?.is_active ?? true,
        }
    );

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
                          toast.success(
                              'Post atualizado com sucesso!'
                          );
                      },
                      onError: () => {
                          toast.error('Erro ao atualizar o Post.');
                      },
                  }
              )
            : send(route("admin.posts.store"), data, {
                  forceFormData: true,
                  onSuccess: () => {
                      toast.success('Post criado com sucesso!');
                  },
                  onError: () => {
                      toast.error('Erro ao criar o Post.');
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
                            {data.id
                                ? 'Editar Post'
                                : 'Criar Post'}
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
                                        <Label htmlFor="icon" value="Ícone" />
                                        <Input
                                            id="icon"
                                            type="file"
                                            accept="image/*"
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "icon",
                                                    e.target.files[0]
                                                )
                                            }
                                            disabled={processing}
                                        />
                                        <div>
                                            {post.icon && (
                                                <img
                                                    src={`/storage/${post.icon}`}
                                                    alt="Ícone"
                                                    className="max-h-50 max-w-36 bg-slate-200"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-1/5">
                                            <Label
                                                htmlFor="sort_order"
                                                value="Ordem"
                                            />
                                            <Input
                                                id="sort_order"
                                                type="number"
                                                value={data.sort_order}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "sort_order",
                                                        e.target.value
                                                    )
                                                }
                                                disabled={processing}
                                            />
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
                                                        e.target.checked
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
                                            href={route(
                                                "admin.posts.index"
                                            )}
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
