import { Head, useForm, usePage } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ValidationErrors from "@/Components/Admin/ValidationErrors";
import LoadingForm from "@/Components/Admin/LoadingForm";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import ActionButton from "@/Components/Admin/ActionButton";
import NavButton from "@/Components/Admin/NavButton";
import ToggleButton from "@/Components/Admin/ToggleButton";

export default function Form({ user = null, roles = [] }) {
    const isEditing = !!user?.id;
    const currentUser = usePage().props.auth.user;
    const isSuperAdmin = usePage().props.auth.isSuperAdmin;
    const isSelf = isEditing && user.id === currentUser.id;
    const canEditPrivileges = !isSelf;

    const { data, setData, post, put, processing, errors } = useForm({
        name:           user?.name           ?? "",
        email:          user?.email          ?? "",
        password:       "",
        role_id:        user?.role_id        ?? "",
        is_super_admin: user?.is_super_admin ?? false,
    });

    const submit = (e) => {
        e.preventDefault();
        const handlers = {
            onSuccess: () => toast.success(isEditing ? "Usuário atualizado!" : "Usuário criado!"),
            onError:   () => toast.error("Verifique os campos e tente novamente."),
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
                        {isEditing ? "Editar Usuário" : "Criar Usuário"}
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="p-6">
                                <ValidationErrors errors={errors} className="mb-4" />

                                <form onSubmit={submit} className="flex flex-col gap-5">
                                    <div>
                                        <Label htmlFor="name" value="Nome *" />
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
                                        <Label htmlFor="email" value="E-mail *" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("email", e.target.value)}
                                            disabled={processing}
                                        />
                                    </div>

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
                                        {!canEditPrivileges && (
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
                                                />
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    Acesso irrestrito ao painel; ignora permissões do perfil.
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                                        {processing && <LoadingForm />}
                                        <NavButton
                                            href={route("admin.users.index")}
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
