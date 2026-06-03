import { useState } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminSearchForm from "@/Components/Admin/AdminSearchForm";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ToggleActive from "@/Components/Admin/ToggleActive";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaPen, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useCan } from "@/hooks/useCan";

export default function Index({ posts, filter, trashedCount = 0 }) {
    const can = useCan();
    const { data, setData, get } = useForm({
        q: filter?.q || "",
    });
    const [pending, setPending] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.posts.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q },
        });
    };

    const deleteConfirm = (url) => {
        setPending({
            message: "Deseja realmente excluir este post?",
            onConfirm: () => router.delete(url, {
                preserveScroll: true,
                onError: () => toast.error("Erro ao excluir o post."),
            }),
        });
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

                        <div className="flex gap-2">
                            {can('posts.delete') && (
                                <NavButton href={route("admin.posts.trashed")} variant="secondary">
                                    Lixeira{trashedCount > 0 && ` (${trashedCount})`}
                                </NavButton>
                            )}
                            {can('posts.create') && (
                                <NavButton href={route("admin.posts.create")}>
                                    Cadastrar
                                </NavButton>
                            )}
                        </div>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <AdminSearchForm value={data.q} onChange={(v) => setData("q", v)} onSubmit={submit} />

                                <div className="w-full">
                                    {posts.data.length > 0 ? (
                                        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Imagem de Capa
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Título
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Ativo
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Ações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {posts.data.map(
                                                    (post) => (
                                                        <tr key={post.id}>
                                                            <td className="py-4 px-6">
                                                                <div>
                                                                    {post.banner_image_url && (
                                                                        <img
                                                                            src={post.banner_image_url}
                                                                            alt="Imagem"
                                                                            className="max-h-30 max-w-24 bg-slate-200"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-6 font-medium dark:text-gray-100">
                                                                {post.title}
                                                            </td>
                                                            <td className="py-4 px-6 text-center">
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
                                                            <td className="py-4 px-6 flex gap-3 justify-end">
                                                                {!can('posts.edit') && can('posts.view') && (
                                                                    <NavButton
                                                                        href={route("admin.posts.edit", post)}
                                                                        title="Visualizar"
                                                                    >
                                                                        <FaEye />
                                                                    </NavButton>
                                                                )}
                                                                {can('posts.edit') && (
                                                                    <NavButton
                                                                        href={route(
                                                                            "admin.posts.edit",
                                                                            post,
                                                                        )}
                                                                        title="Editar"
                                                                    >
                                                                        <FaPen />
                                                                    </NavButton>
                                                                )}
                                                                {can('posts.delete') && (
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
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
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

            <ConfirmModal
                show={!!pending}
                message={pending?.message}
                onConfirm={() => { pending?.onConfirm(); setPending(null); }}
                onCancel={() => setPending(null)}
            />
        </>
    );
}
