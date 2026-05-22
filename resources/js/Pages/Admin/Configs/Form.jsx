import { Head, useForm, usePage } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ValidationErrors from "@/Components/Admin/ValidationErrors";
import Input from "@/Components/Admin/Input";
import Label from "@/Components/Admin/Label";
import TextareaAutosize from "react-textarea-autosize";

function Section({ title, children }) {
    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
            </div>
            <div className="p-5 flex flex-col gap-4">{children}</div>
        </div>
    );
}

function Field({ label, hint, children }) {
    return (
        <div>
            <Label value={label} />
            {children}
            {hint && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
        </div>
    );
}

export default function Form({ values = {} }) {
    const { props } = usePage();

    const { data, setData, put, processing, errors } = useForm({
        config: {
            site_name:            values.site_name             ?? "",
            site_tagline:         values.site_tagline          ?? "",
            footer_facebook:      values.footer_facebook      ?? "",
            footer_instagram:     values.footer_instagram     ?? "",
            footer_youtube:       values.footer_youtube        ?? "",
            footer_message:       values.footer_message        ?? "",
            contact_email:        values.contact_email         ?? "",
            contact_address:      values.contact_address       ?? "",
            contact_address_link: values.contact_address_link  ?? "",
            scripts_head:         values.scripts_head          ?? "",
            scripts_body:         values.scripts_body          ?? "",
        },
    });

    const set = (key) => (e) => setData("config", { ...data.config, [key]: e.target.value });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.configs.update"), {
            onError: () => toast.error("Verifique os campos e tente novamente."),
        });
    };

    const textareaClass =
        "mt-1 block w-full font-mono text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50";

    return (
        <>
            <Head title="Configurações" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">
                        Configurações
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                        <ValidationErrors errors={errors} className="mb-4" />

                        <form onSubmit={submit} className="flex flex-col gap-6">

                            {/* Geral */}
                            <Section title="Geral">
                                <Field label="Nome do site" hint="Exibido ao lado da logo no header/footer e na aba do navegador.">
                                    <Input
                                        type="text"
                                        value={data.config.site_name}
                                        onChange={set("site_name")}
                                        placeholder="DevHub"
                                        className="mt-1 block w-full"
                                        disabled={processing}
                                    />
                                </Field>
                                <Field label="Tagline do site" hint="Frase exibida como slogan principal do site.">
                                    <Input
                                        type="text"
                                        value={data.config.site_tagline}
                                        onChange={set("site_tagline")}
                                        placeholder="Conectando ideias, pessoas e tecnologias…"
                                        className="mt-1 block w-full"
                                        disabled={processing}
                                    />
                                </Field>
                            </Section>

                            {/* Rodapé */}
                            <Section title="Rodapé">
                                <Field label="Facebook">
                                    <Input
                                        type="url"
                                        value={data.config.footer_facebook}
                                        onChange={set("footer_facebook")}
                                        placeholder="https://facebook.com/perfil"
                                        className="mt-1 block w-full"
                                        disabled={processing}
                                    />
                                </Field>
                                <Field label="Instagram">
                                    <Input
                                        type="url"
                                        value={data.config.footer_instagram}
                                        onChange={set("footer_instagram")}
                                        placeholder="https://instagram.com/perfil"
                                        className="mt-1 block w-full"
                                        disabled={processing}
                                    />
                                </Field>
                                <Field label="YouTube">
                                    <Input
                                        type="url"
                                        value={data.config.footer_youtube}
                                        onChange={set("footer_youtube")}
                                        placeholder="https://youtube.com/@canal"
                                        className="mt-1 block w-full"
                                        disabled={processing}
                                    />
                                </Field>
                                <Field label="Mensagem do rodapé" hint="Texto exibido na parte inferior do site, ex: © 2025 DevHub. Todos os direitos reservados.">
                                    <Input
                                        type="text"
                                        value={data.config.footer_message}
                                        onChange={set("footer_message")}
                                        className="mt-1 block w-full"
                                        disabled={processing}
                                    />
                                </Field>
                            </Section>

                            {/* Contato */}
                            <Section title="Contato">
                                <Field label="E-mail de contato">
                                    <Input
                                        type="email"
                                        value={data.config.contact_email}
                                        onChange={set("contact_email")}
                                        placeholder="contato@exemplo.com"
                                        className="mt-1 block w-full"
                                        disabled={processing}
                                    />
                                </Field>
                                <Field label="Endereço">
                                    <Input
                                        type="text"
                                        value={data.config.contact_address}
                                        onChange={set("contact_address")}
                                        placeholder="Rua Exemplo, 123 — São Paulo, SP"
                                        className="mt-1 block w-full"
                                        disabled={processing}
                                    />
                                </Field>
                                <Field label="Link do endereço" hint="URL do Google Maps ou similar.">
                                    <Input
                                        type="url"
                                        value={data.config.contact_address_link}
                                        onChange={set("contact_address_link")}
                                        placeholder="https://maps.google.com/..."
                                        className="mt-1 block w-full"
                                        disabled={processing}
                                    />
                                </Field>
                            </Section>

                            {/* Scripts */}
                            <Section title="Scripts de rastreamento">
                                <Field
                                    label="Scripts do <head>"
                                    hint="Cole aqui scripts que devem ser inseridos no <head> da página, como Google Tag Manager ou Meta Pixel."
                                >
                                    <TextareaAutosize
                                        value={data.config.scripts_head}
                                        onChange={set("scripts_head")}
                                        className={textareaClass}
                                        minRows={4}
                                        maxRows={12}
                                        placeholder={"<!-- Google Tag Manager -->\n<script>...</script>"}
                                        disabled={processing}
                                    />
                                </Field>
                                <Field
                                    label="Scripts do <body>"
                                    hint="Scripts que devem ser inseridos logo após a abertura da tag <body>, como o noscript do Google Tag Manager."
                                >
                                    <TextareaAutosize
                                        value={data.config.scripts_body}
                                        onChange={set("scripts_body")}
                                        className={textareaClass}
                                        minRows={4}
                                        maxRows={12}
                                        placeholder={"<!-- Google Tag Manager (noscript) -->\n<noscript>...</noscript>"}
                                        disabled={processing}
                                    />
                                </Field>
                            </Section>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-6 py-2 bg-red-600 text-white text-sm font-semibold uppercase tracking-widest rounded-md hover:bg-red-700 transition-colors ${processing ? "opacity-40" : ""}`}
                                >
                                    {processing ? "Salvando…" : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
