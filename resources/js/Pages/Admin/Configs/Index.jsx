import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import NavButton from "@/Components/Admin/NavButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import { FaPen, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";

function ValuePreview({ value }) {
    if (value === null || value === undefined || value === "") {
        return <span className="italic text-gray-400 dark:text-gray-500">vazio</span>;
    }
    const text = typeof value === "string" ? value : JSON.stringify(value);
    return (
        <span className="font-mono text-xs text-gray-600 dark:text-gray-400 truncate max-w-xs inline-block">
            {text.length > 60 ? text.slice(0, 60) + "…" : text}
        </span>
    );
}

export default function Index({ configs, filter }) {
    const { data, setData, get } = useForm({ q: filter?.q || "" });

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.configs.index"), { preserveState: true, preserveScroll: true });
    };

    const deleteConfirm = (url) => {
        if (confirm("Deseja realmente excluir esta configuração?")) {
            router.delete(url, {
                preserveScroll: true,
                onError: () => toast.error("Erro ao excluir a configuração."),
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
                            Configurações
                        </h2>
                        <NavButton href={route("admin.configs.create")}>
                            Cadastrar
                        </NavButton>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
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
                                                onChange={(e) => setData("q", e.target.value)}
                                                placeholder="Buscar por chave ou grupo..."
                                                className="mt-1 block w-full"
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
                                    {configs.data.length > 0 ? (
                                        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Grupo
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Chave
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Valor
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                        Ações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {configs.data.map((config) => (
                                                    <tr key={config.key}>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                                {config.group}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 font-mono text-sm font-medium dark:text-gray-100">
                                                            {config.key}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <ValuePreview value={config.value} />
                                                        </td>
                                                        <td className="px-6 py-4 flex gap-3 justify-end">
                                                            <NavButton
                                                                href={route("admin.configs.edit", config.key)}
                                                                title="Editar"
                                                            >
                                                                <FaPen />
                                                            </NavButton>
                                                            <ActionButton
                                                                theme="light"
                                                                onClick={() =>
                                                                    deleteConfirm(
                                                                        route("admin.configs.destroy", config.key)
                                                                    )
                                                                }
                                                            >
                                                                <FaTrash className="text-white" />
                                                            </ActionButton>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                            Nenhuma configuração encontrada.
                                        </div>
                                    )}
                                </div>

                                <div className="w-full">
                                    <Pagination links={configs.links} className="my-4 self-center" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
