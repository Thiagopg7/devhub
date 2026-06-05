import { useState } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminSearchForm from "@/Components/Admin/AdminSearchForm";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ToggleActive from "@/Components/Admin/ToggleActive";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import { FaPen, FaTrash, FaEye, FaStar } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useCan } from "@/hooks/useCan";

const selectCls = "py-2 px-3 text-sm rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition";

const formatPublishedAt = (value) =>
    value ? new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const isScheduled = (value) => value && new Date(value) > new Date();

export default function Index({ posts, filter, trashedCount = 0, categories = [] }) {
    const can = useCan();
    const { data, setData, get } = useForm({
        q: filter?.q || "",
        category: filter?.category || "",
        status: filter?.status || "",
    });
    const [pending, setPending] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.posts.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q, category: data.category, status: data.status },
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
                                <AdminSearchForm value={data.q} onChange={(v) => setData("q", v)} onSubmit={submit} placeholder="Título do post...">
                                    <select value={data.category} onChange={(e) => setData("category", e.target.value)} className={selectCls}>
                                        <option value="">Todas as categorias</option>
                                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <select value={data.status} onChange={(e) => setData("status", e.target.value)} className={selectCls}>
                                        <option value="">Qualquer status</option>
                                        <option value="1">Ativo</option>
                                        <option value="0">Inativo</option>
                                    </select>
                                </AdminSearchForm>

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
                                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Destaque
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Publicação
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Ações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {posts.data.map(
                                                    (post) => (
                                                        <tr key={post.id}>
                                                            <td className="py-4 px-6">
                                                                <div className="w-28 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded overflow-hidden shrink-0">
                                                                    {post.banner_image_url ? (
                                                                        <img
                                                                            src={post.banner_image_url}
                                                                            alt="Imagem"
                                                                            className="max-w-full max-h-full object-contain"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-xs text-gray-400">Sem imagem</span>
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
                                                            <td className="py-4 px-6 text-center">
                                                                <FaStar
                                                                    className={`inline-block ${post.is_featured ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                                                                    title={post.is_featured ? "Em destaque na home" : "Sem destaque"}
                                                                />
                                                            </td>
                                                            <td className="py-4 px-6 text-center text-sm">
                                                                <span className="dark:text-gray-300">{formatPublishedAt(post.published_at)}</span>
                                                                {isScheduled(post.published_at) && (
                                                                    <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                                                        Agendado
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-6 align-middle"><div className="flex gap-3 justify-center items-center">
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
                                                            </div></td>
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
