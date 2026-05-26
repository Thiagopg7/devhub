import { Head, useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ValidationErrors from "@/Components/Admin/ValidationErrors";
import LoadingForm from "@/Components/Admin/LoadingForm";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import ActionButton from "@/Components/Admin/ActionButton";
import NavButton from "@/Components/Admin/NavButton";

export default function Form({ posts = [] }) {
    const { data, setData, post: send, processing, errors } = useForm({
        title:        "",
        subject:      "",
        post_ids:     [],
        scheduled_at: "",
    });

    const togglePost = (id) => {
        setData("post_ids", data.post_ids.includes(id)
            ? data.post_ids.filter((p) => p !== id)
            : [...data.post_ids, id]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        send(route("admin.newsletter-campaigns.store"), {
            onError: () => toast.error("Erro ao criar a campanha."),
        });
    };

    return (
        <>
            <Head title="Nova Campanha" />

            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl leading-tight">Nova Campanha</h2>}
            >
                <div className="py-12">
                    <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="p-6">
                                <ValidationErrors errors={errors} className="mb-4" />

                                <form onSubmit={submit} className="flex flex-col gap-5">
                                    <div>
                                        <Label htmlFor="title" value="Título interno" />
                                        <Input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("title", e.target.value)}
                                            disabled={processing}
                                            autoFocus
                                        />
                                        <p className="mt-1 text-xs text-gray-400">Usado apenas no painel admin para identificar a campanha.</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="subject" value="Assunto do e-mail" />
                                        <Input
                                            id="subject"
                                            type="text"
                                            value={data.subject}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("subject", e.target.value)}
                                            disabled={processing}
                                        />
                                        <p className="mt-1 text-xs text-gray-400">Texto que aparece na linha de assunto do e-mail.</p>
                                    </div>

                                    <div>
                                        <Label value="Posts incluídos" />
                                        {posts.length === 0 ? (
                                            <p className="text-sm text-gray-400 mt-1">Nenhum post publicado disponível.</p>
                                        ) : (
                                            <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-700 max-h-64 overflow-y-auto">
                                                {posts.map((post) => (
                                                    <label key={post.id} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.post_ids.includes(post.id)}
                                                            onChange={() => togglePost(post.id)}
                                                            disabled={processing}
                                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                        />
                                                        <span className="text-sm dark:text-gray-200">{post.title}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {errors.post_ids && <p className="mt-1 text-xs text-red-500">{errors.post_ids}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="scheduled_at" value="Agendar envio (opcional)" />
                                        <Input
                                            id="scheduled_at"
                                            type="datetime-local"
                                            value={data.scheduled_at}
                                            className="mt-1 block w-64"
                                            onChange={(e) => setData("scheduled_at", e.target.value)}
                                            disabled={processing}
                                        />
                                        <p className="mt-1 text-xs text-gray-400">Deixe em branco para salvar como rascunho e enviar manualmente.</p>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 mt-2">
                                        {processing && <LoadingForm />}
                                        <NavButton href={route("admin.newsletter-campaigns.index")} variant="secondary">
                                            Cancelar
                                        </NavButton>
                                        <ActionButton disabled={processing}>
                                            Salvar campanha
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
