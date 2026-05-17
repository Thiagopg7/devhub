import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import ToggleActive from "@/Components/Admin/ToggleActive";
import { FaPen, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function Index({ categories, filter }) {
    const { data, setData, get } = useForm({
        q: filter?.q || "",
    });

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.categories.index"), {
            preserveState: true,
            preserveScroll: true,
            params: { q: data.q },
        });
    };

    const deleteConfirm = (url) => {
        if (confirm("Deseja realmente excluir esta categoria?")) {
            router.delete(url, {
                preserveScroll: true,
                onError: () => toast.error("Erro ao excluir a categoria."),
            });
        }
    };

    return (
        <>
            <Head title="Categorias" />

            <AuthenticatedLayout
                header={
                    <div className="flex w-full justify-between items-center">
                        <h2 className="font-semibold text-xl leading-tight">
                            Categorias
                        </h2>
                        <NavButton href={route("admin.categories.create")}>
                            Cadastrar
                        </NavButton>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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
                                    {categories.data.length > 0 ? (
                                        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Cor
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Nome
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Slug
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
                                                {categories.data.map(
                                                    (category) => (
                                                        <tr key={category.id}>
                                                            <td className="px-6 py-4">
                                                                <span
                                                                    className="inline-block w-6 h-6 rounded-full border border-gray-200"
                                                                    style={{
                                                                        backgroundColor:
                                                                            category.color,
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 font-medium dark:text-gray-100">
                                                                {category.name}
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                                                                {category.slug}
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <ToggleActive
                                                                    id={
                                                                        category.id
                                                                    }
                                                                    model="category"
                                                                    value={
                                                                        category.is_active
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 flex gap-3 justify-end">
                                                                <NavButton
                                                                    href={route(
                                                                        "admin.categories.edit",
                                                                        category,
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
                                                                                "admin.categories.destroy",
                                                                                category,
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
                                        <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                            Nenhuma categoria encontrada.
                                        </div>
                                    )}
                                </div>

                                <div className="w-full">
                                    <Pagination
                                        links={categories.links}
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
