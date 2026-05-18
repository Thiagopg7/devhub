import { useMemo } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ValidationErrors from "@/Components/Admin/ValidationErrors";
import LoadingForm from "@/Components/Admin/LoadingForm";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import ActionButton from "@/Components/Admin/ActionButton";
import NavButton from "@/Components/Admin/NavButton";

const ACTION_LABELS = {
    view:   "Ver",
    create: "Criar",
    edit:   "Editar",
    delete: "Excluir",
};

export default function Form({ role = null }) {
    const isEditing = !!role?.id;
    const { permissionsCatalog } = usePage().props;
    const { modules = {}, actions = [] } = permissionsCatalog ?? {};

    const moduleKeys = useMemo(() => Object.keys(modules), [modules]);

    const allPermissions = useMemo(() => {
        const list = [];
        moduleKeys.forEach((m) => actions.forEach((a) => list.push(`${m}.${a}`)));
        return list;
    }, [moduleKeys, actions]);

    const { data, setData, post, put, processing, errors, transform } = useForm({
        name:        role?.name        ?? "",
        permissions: role?.permissions ?? [],
    });

    const has = (perm) => data.permissions.includes(perm);

    const togglePermission = (perm) => {
        setData("permissions", has(perm)
            ? data.permissions.filter((p) => p !== perm)
            : [...data.permissions, perm]
        );
    };

    const toggleRow = (module) => {
        const rowPerms = actions.map((a) => `${module}.${a}`);
        const allOn    = rowPerms.every((p) => has(p));
        setData("permissions", allOn
            ? data.permissions.filter((p) => !rowPerms.includes(p))
            : Array.from(new Set([...data.permissions, ...rowPerms]))
        );
    };

    const toggleColumn = (action) => {
        const colPerms = moduleKeys.map((m) => `${m}.${action}`);
        const allOn    = colPerms.every((p) => has(p));
        setData("permissions", allOn
            ? data.permissions.filter((p) => !colPerms.includes(p))
            : Array.from(new Set([...data.permissions, ...colPerms]))
        );
    };

    const toggleAll = () => {
        const allOn = allPermissions.every((p) => has(p));
        setData("permissions", allOn ? [] : [...allPermissions]);
    };

    const rowAllOn    = (module) => actions.every((a) => has(`${module}.${a}`));
    const colAllOn    = (action) => moduleKeys.every((m) => has(`${m}.${action}`));
    const everythingOn = allPermissions.length > 0 && allPermissions.every((p) => has(p));

    const submit = (e) => {
        e.preventDefault();
        const handlers = {
            onSuccess: () => toast.success(isEditing ? "Perfil atualizado!" : "Perfil criado!"),
            onError:   () => toast.error("Verifique os campos e tente novamente."),
        };
        if (isEditing) {
            put(route("admin.roles.update", role.id), handlers);
        } else {
            post(route("admin.roles.store"), handlers);
        }
    };

    return (
        <>
            <Head title="Perfis" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">
                        {isEditing ? "Editar Perfil" : "Criar Perfil"}
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="p-6">
                                <ValidationErrors errors={errors} className="mb-4" />

                                <form onSubmit={submit} className="flex flex-col gap-5">
                                    <div className="max-w-md">
                                        <Label htmlFor="name" value="Nome do perfil *" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("name", e.target.value)}
                                            disabled={processing}
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <Label value="Permissões" className="!font-semibold !text-base" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                            Marque o que este perfil poderá fazer no painel.
                                        </p>

                                        <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left">
                                                            <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-300 font-semibold">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded text-red-600 focus:ring-red-600"
                                                                    checked={everythingOn}
                                                                    onChange={toggleAll}
                                                                    disabled={processing}
                                                                />
                                                                Módulo
                                                            </label>
                                                        </th>
                                                        {actions.map((action) => (
                                                            <th key={action} className="px-3 py-2 text-center">
                                                                <label className="flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-300 font-semibold">
                                                                    <span>{ACTION_LABELS[action] ?? action}</span>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded text-red-600 focus:ring-red-600"
                                                                        checked={colAllOn(action)}
                                                                        onChange={() => toggleColumn(action)}
                                                                        disabled={processing}
                                                                    />
                                                                </label>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {moduleKeys.map((module) => (
                                                        <tr key={module}>
                                                            <td className="px-3 py-2">
                                                                <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded text-red-600 focus:ring-red-600"
                                                                        checked={rowAllOn(module)}
                                                                        onChange={() => toggleRow(module)}
                                                                        disabled={processing}
                                                                    />
                                                                    {modules[module]}
                                                                </label>
                                                            </td>
                                                            {actions.map((action) => {
                                                                const perm = `${module}.${action}`;
                                                                return (
                                                                    <td key={action} className="px-3 py-2 text-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="rounded text-red-600 focus:ring-red-600"
                                                                            checked={has(perm)}
                                                                            onChange={() => togglePermission(perm)}
                                                                            disabled={processing}
                                                                            aria-label={`${modules[module]} - ${ACTION_LABELS[action] ?? action}`}
                                                                        />
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                                        {processing && <LoadingForm />}
                                        <NavButton
                                            href={route("admin.roles.index")}
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
