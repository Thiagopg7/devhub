import { Head, useForm, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ToggleActive from "@/Components/Admin/ToggleActive";
import { FaPen, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function Index({ auth, posts, filter }) {
    const { data, setData, get } = useForm({
        q: filter?.q || "",
    });

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.posts.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q },
        });
    };

    const deleteConfirm = (url) => {
        if (confirm("Deseja realmente excluir este item?")) {
            router.delete(url, {
                preserveScroll: true,
                onSuccess: () => {},
                onError: () => {
                    toast.error(`Erro ao excluir o post.`);
                },
            });
        }
    };
    return (
        <>
            <Head title="Posts" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">
                            Posts
                        </h2>

                        <NavButton href={route("admin.posts.create")}>
                            Cadastrar
                        </NavButton>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <form onSubmit={submit} className="mb-4">
                                    <div className="w-full mb-4">
                                        <Label
                                            htmlFor="q"
                                            value="Pesquisa"
                                            className="!font-semibold !text-base"
                                        />
                                        <div className="flex gap-4 items-center">
                                            <Input
                                                id="q"
                                                type="text"
                                                value={data.q}
                                                onChange={(e) =>
                                                    setData("q", e.target.value)
                                                }
                                                className="border-gray-300 focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50 mt-1 block w-full"
                                            />
                                            <button
                                                type="submit"
                                                className="bg-red-600 py-2 px-4 rounded-md text-white"
                                            >
                                                <FaSearch />
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <div className="w-full">
                                    {posts.data.length > 0 ? (
                                        <table className="w-full min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase">
                                                        Capa
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase">
                                                        Título
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 uppercase">
                                                        Ativo
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 uppercase">
                                                        Ações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {posts.data.map(
                                                    (post) => (
                                                        <tr key={post.id}>
                                                            <td className="pt-4 px-6">
                                                                <div>
                                                                    {post.banner_image && (
                                                                        <img
                                                                            src={`/storage/${post.banner_image}`}
                                                                            alt="Imagem"
                                                                            className="max-h-30 max-w-24 bg-slate-200"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="pt-4 px-6">
                                                                {post.title}
                                                            </td>
                                                            <td className="pt-4 px-6 text-center">
                                                                <ToggleActive
                                                                    id={
                                                                        post.id
                                                                    }
                                                                    model="post"
                                                                    value={
                                                                        post.is_active
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="pt-8 px-6 flex gap-3 justify-end">
                                                                <NavButton
                                                                    href={route(
                                                                        "admin.posts.edit",
                                                                        post,
                                                                    )}
                                                                    title="Editar"
                                                                >
                                                                    <FaPen />
                                                                </NavButton>

                                                                <ActionButton
                                                                    theme="light"
                                                                    onClick={() =>
                                                                        deleteConfirm(
                                                                            route(
                                                                                "admin.posts.destroy",
                                                                                post,
                                                                            ),
                                                                        )
                                                                    }
                                                                >
                                                                    <FaTrash className="text-white" />
                                                                </ActionButton>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-center py-8 text-sm text-gray-500">
                                            Nenhum Post encontrado.
                                        </div>
                                    )}
                                </div>

                                <div className="w-full">
                                    <Pagination
                                        links={posts.links}
                                        className="my-4 self-center"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
