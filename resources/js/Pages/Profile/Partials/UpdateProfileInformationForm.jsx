import InputError from '@/Components/Admin/InputError';
import InputLabel from '@/Components/Admin/InputLabel';
import PrimaryButton from '@/Components/Admin/PrimaryButton';
import TextInput from '@/Components/Admin/TextInput';
import ImageSlot from '@/Components/Admin/ImageSlot';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-hot-toast';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing } =
        useForm({
            _method: 'patch',
            name: user.name,
            email: user.email,
            bio: user.bio || '',
            avatar_image: null,
        });

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
            forceFormData: true,
            onError: () => toast.error('Erro ao atualizar o perfil.'),
        });
    };

    const deleteAvatar = () => {
        router.delete(route('profile.avatar.destroy'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Avatar removido!'),
            onError: () => toast.error('Erro ao remover o avatar.'),
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Informações do Perfil
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Atualize as informações do seu perfil e endereço de e-mail.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nome" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="E-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="bio" value="Biografia" />

                    <TextareaAutosize
                        id="bio"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                        value={data.bio}
                        minRows={3}
                        maxRows={8}
                        onChange={(e) => setData('bio', e.target.value)}
                        placeholder="Uma breve apresentação que aparece nos seus artigos."
                    />

                    <InputError className="mt-2" message={errors.bio} />
                </div>

                <div>
                    <ImageSlot
                        label="Avatar"
                        currentUrl={user.avatar_image_url}
                        fieldName="avatar_image"
                        onChange={(field, file) => setData(field, file)}
                        onDelete={deleteAvatar}
                        processing={processing}
                    />

                    <InputError className="mt-2" message={errors.avatar_image} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Seu endereço de e-mail não foi verificado.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Clique aqui para reenviar o e-mail de verificação.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Um novo link de verificação foi enviado para o seu e-mail.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Salvar</PrimaryButton>
                </div>
            </form>
        </section>
    );
}
