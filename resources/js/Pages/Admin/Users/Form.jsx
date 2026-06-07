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
import ToggleButton from "@/Components/Admin/ToggleButton";
import { useCan } from "@/hooks/useCan";

export default function Form({ user = null, roles = [] }) {
    const can = useCan();
    const isEditing = !!user?.id;
    const readonly = isEditing && !can('users.edit');
    const currentUser = usePage().props.auth.user;
    const isSuperAdmin = usePage().props.auth.isSuperAdmin;
    const isSelf = isEditing && user.id === currentUser.id;
    const canEditPrivileges = !isSelf && !readonly;

    const { data, setData, post, put, processing, errors } = useForm({
        name:                  user?.name           ?? "",
        email:                 user?.email          ?? "",
        password:              "",
        password_confirmation: "",
        role_id:               user?.role_id        ?? "",
        is_super_admin:        user?.is_super_admin ?? false,
    });

    const submit = (e) => {
        e.preventDefault();
        const handlers = {
            onError: () => toast.error("Verifique os campos e tente novamente."),
        };
        if (isEditing) {
            put(route("admin.users.update", user.id), handlers);
        } else {
            post(route("admin.users.store"), handlers);
        }
    };

    return (
        <>
            <Head title="Usuários" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">
                        {readonly ? "Visualizar Usuário" : isEditing ? "Editar Usuário" : "Criar Usuário"}
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="p-6">
                                <ValidationErrors errors={errors} className="mb-4" />
                                {readonly && <ReadonlyBanner />}

                                <form onSubmit={submit} className="flex flex-col gap-5">
                                    <div>
                                        <Label htmlFor="name" value="Nome *" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("name", e.target.value)}
                                            disabled={processing || readonly}
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="email" value="E-mail *" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("email", e.target.value)}
                                            disabled={processing || readonly}
                                        />
                                    </div>

                                    {!readonly && (
                                        <>
                                            <div>
                                                <Label htmlFor="password" value={isEditing ? "Nova senha" : "Senha *"} />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={data.password}
                                                    className="mt-1 block w-full"
                                                    placeholder={isEditing ? "Deixe em branco para manter a atual" : ""}
                                                    onChange={(e) => setData("password", e.target.value)}
                                                    disabled={processing}
                                                    autoComplete="new-password"
                                                />
                                            </div>

                                            {(!isEditing || data.password) && (
                                                <div>
                                                    <Label htmlFor="password_confirmation" value={isEditing ? "Confirmar nova senha" : "Confirmar senha *"} />
                                                    <Input
                                                        id="password_confirmation"
                                                        type="password"
                                                        value={data.password_confirmation}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                                        disabled={processing}
                                                        autoComplete="new-password"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div>
                                        <Label htmlFor="role_id" value="Perfil" />
                                        <select
                                            id="role_id"
                                            value={data.role_id ?? ""}
                                            onChange={(e) => setData("role_id", e.target.value)}
                                            disabled={processing || !canEditPrivileges}
                                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50 disabled:opacity-60"
                                        >
                                            <option value="">— Sem perfil —</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </select>
                                        {!readonly && !canEditPrivileges && (
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                Você não pode alterar o próprio perfil.
                                            </p>
                                        )}
                                    </div>

                                    {isSuperAdmin && canEditPrivileges && (
                                        <div>
                                            <Label value="Super admin" />
                                            <div className="flex items-center gap-3 mt-1">
                                                <ToggleButton
                                                    checked={!!data.is_super_admin}
                                                    onChange={(e) => setData("is_super_admin", e.target.checked)}
                                                    disabled={processing || readonly}
                                                />
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    Acesso irrestrito ao painel; ignora permissões do perfil.
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                                        {!readonly && processing && <LoadingForm />}
                                        <NavButton
                                            href={route("admin.users.index")}
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
        </>
    );
}
