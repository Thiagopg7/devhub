import { useMemo } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ValidationErrors from "@/Components/Admin/ValidationErrors";
import ReadonlyBanner from "@/Components/Admin/ReadonlyBanner";
import LoadingForm from "@/Components/Admin/LoadingForm";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import ActionButton from "@/Components/Admin/ActionButton";
import NavButton from "@/Components/Admin/NavButton";
import { useCan } from "@/hooks/useCan";

const ACTION_LABELS = {
    view:   "Ver",
    create: "Criar",
    edit:   "Editar",
    delete: "Excluir",
};

export default function Form({ role = null }) {
    const can = useCan();
    const isEditing = !!role?.id;
    const readonly = isEditing && !can('roles.edit');
    const locked = !!role?.is_system;
    const { permissionsCatalog, auth } = usePage().props;
    const { modules = {}, actions = [] } = permissionsCatalog ?? {};
    const isSuperAdmin = auth?.isSuperAdmin ?? false;
    const myPermissions = auth?.permissions ?? [];

    const moduleKeys = useMemo(() => Object.keys(modules), [modules]);

    const allPermissions = useMemo(() => {
        const list = [];
        moduleKeys.forEach((m) => actions.forEach((a) => list.push(`${m}.${a}`)));
        return list;
    }, [moduleKeys, actions]);

    const canGrant = (perm) => isSuperAdmin || myPermissions.includes(perm);
    const editable = (perm) => !locked && !readonly && canGrant(perm);

    const { data, setData, post, put, processing, errors } = useForm({
        name:        role?.name        ?? "",
        permissions: role?.permissions ?? [],
    });

    const has = (perm) => data.permissions.includes(perm);

    const togglePermission = (perm) => {
        if (!editable(perm)) return;
        setData("permissions", has(perm)
            ? data.permissions.filter((p) => p !== perm)
            : [...data.permissions, perm]
        );
    };

    const toggleSet = (perms) => {
        const targets = perms.filter(editable);
        if (targets.length === 0) return;
        const allOn = targets.every((p) => has(p));
        setData("permissions", allOn
            ? data.permissions.filter((p) => !targets.includes(p))
            : Array.from(new Set([...data.permissions, ...targets]))
        );
    };

    const toggleRow    = (module) => toggleSet(actions.map((a) => `${module}.${a}`));
    const toggleColumn = (action) => toggleSet(moduleKeys.map((m) => `${m}.${action}`));
    const toggleAll    = () => toggleSet(allPermissions);

    const groupAllOn = (perms) => {
        const targets = perms.filter(canGrant);
        return targets.length > 0 && targets.every((p) => has(p));
    };
    const rowAllOn     = (module) => groupAllOn(actions.map((a) => `${module}.${a}`));
    const colAllOn     = (action) => groupAllOn(moduleKeys.map((m) => `${m}.${action}`));
    const everythingOn = groupAllOn(allPermissions);

    const submit = (e) => {
        e.preventDefault();
        if (locked || readonly) return;
        const handlers = {
            onError: () => toast.error("Verifique os campos e tente novamente."),
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
                        {readonly ? "Visualizar Perfil" : isEditing ? "Editar Perfil" : "Criar Perfil"}
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="p-6">
                                <ValidationErrors errors={errors} className="mb-4" />

                                {readonly && <ReadonlyBanner />}

                                {locked && !readonly && (
                                    <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                                        Este é um <strong>perfil de sistema</strong>: possui sempre todas as
                                        permissões e não pode ser alterado nem excluído.
                                    </div>
                                )}

                                <form onSubmit={submit} className="flex flex-col gap-5">
                                    <div className="max-w-md">
                                        <Label htmlFor="name" value="Nome do perfil *" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("name", e.target.value)}
                                            disabled={processing || locked || readonly}
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
                                                                    disabled={processing || locked || readonly}
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
                                                                        disabled={processing || locked || readonly}
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
                                                                        disabled={processing || locked || readonly}
                                                                    />
                                                                    {modules[module]}
                                                                </label>
                                                            </td>
                                                            {actions.map((action) => {
                                                                const perm = `${module}.${action}`;
                                                                const grantable = canGrant(perm);
                                                                return (
                                                                    <td key={action} className="px-3 py-2 text-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="rounded text-red-600 focus:ring-red-600 disabled:opacity-50"
                                                                            checked={has(perm)}
                                                                            onChange={() => togglePermission(perm)}
                                                                            disabled={processing || locked || readonly || !grantable}
                                                                            title={!grantable && !locked && !readonly ? "Você não possui esta permissão" : undefined}
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
                                        {!isSuperAdmin && !locked && !readonly && (
                                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                Você só pode conceder permissões que já possui.
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                                        {!readonly && processing && <LoadingForm />}
                                        <NavButton
                                            href={route("admin.roles.index")}
                                            variant="secondary"
                                            className={`ml-8 ${processing ? "opacity-40" : ""}`}
                                        >
                                            {locked || readonly ? "Voltar" : "Cancelar"}
                                        </NavButton>
                                        {!locked && !readonly && (
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
        </>
    );
}
