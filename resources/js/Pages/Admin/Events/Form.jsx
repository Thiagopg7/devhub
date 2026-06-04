import { Head, useForm } from "@inertiajs/react";
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

const TYPE_OPTIONS = [
    { value: "conf",     label: "Conferência" },
    { value: "meetup",   label: "Meetup" },
    { value: "workshop", label: "Workshop" },
    { value: "hack",     label: "Hackathon" },
];

const STATUS_OPTIONS = [
    { value: "open", label: "Inscrições abertas" },
    { value: "soon", label: "Em breve" },
    { value: "full", label: "Lotado" },
];

const CTA_STYLE_OPTIONS = [
    { value: "primary", label: "Primário (destaque)" },
    { value: "ghost",   label: "Ghost (contorno)" },
];

export default function Form({ event = null }) {
    const can = useCan();
    const isEditing = !!event?.id;
    const readonly = isEditing && !can("events.edit");

    const { data, setData, post: send, processing, errors, transform } = useForm({
        title:     event?.title     ?? "",
        type:      event?.type      ?? "conf",
        org:       event?.org       ?? "",
        date:      event?.date      ? event.date.substring(0, 10) : "",
        time:      event?.time      ?? "",
        location:  event?.location  ?? "",
        is_online: event?.is_online ?? false,
        status:    event?.status    ?? "open",
        cta_label: event?.cta_label ?? "",
        cta_style: event?.cta_style ?? "primary",
        cta_url:   event?.cta_url   ?? "",
        seats:     event?.seats     ?? "",
        seats_low: event?.seats_low ?? false,
        is_active: event?.is_active ?? true,
        order:     event?.order     ?? "",
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            transform((d) => ({ ...d, _method: "PUT" }));
            send(route("admin.events.update", event.id), {
                onError: () => toast.error("Erro ao atualizar o evento."),
            });
        } else {
            send(route("admin.events.store"), {
                onError: () => toast.error("Erro ao criar o evento."),
            });
        }
    };

    const selectClass = "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-50 disabled:opacity-60";

    return (
        <>
            <Head title="Eventos" />

            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl leading-tight">
                        {readonly ? "Visualizar Evento" : isEditing ? "Editar Evento" : "Novo Evento"}
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="block p-5">
                                <ValidationErrors errors={errors} className="mb-4" />
                                {readonly && <ReadonlyBanner />}

                                <form onSubmit={submit} className="flex flex-col gap-4">

                                    <div>
                                        <Label htmlFor="title" value="Título" />
                                        <Input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("title", e.target.value)}
                                            disabled={processing || readonly}
                                            autoFocus
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="type" value="Tipo" />
                                            <select
                                                id="type"
                                                value={data.type}
                                                className={selectClass}
                                                onChange={(e) => setData("type", e.target.value)}
                                                disabled={processing || readonly}
                                            >
                                                {TYPE_OPTIONS.map((o) => (
                                                    <option key={o.value} value={o.value}>{o.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <Label htmlFor="status" value="Status" />
                                            <select
                                                id="status"
                                                value={data.status}
                                                className={selectClass}
                                                onChange={(e) => setData("status", e.target.value)}
                                                disabled={processing || readonly}
                                            >
                                                {STATUS_OPTIONS.map((o) => (
                                                    <option key={o.value} value={o.value}>{o.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="org" value="Organização" />
                                        <Input
                                            id="org"
                                            type="text"
                                            value={data.org}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("org", e.target.value)}
                                            disabled={processing || readonly}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="date" value="Data" />
                                            <Input
                                                id="date"
                                                type="date"
                                                value={data.date}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("date", e.target.value)}
                                                disabled={processing || readonly}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="time" value="Horário" />
                                            <Input
                                                id="time"
                                                type="text"
                                                value={data.time}
                                                placeholder="19h00 – 22h00 (BRT)"
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("time", e.target.value)}
                                                disabled={processing || readonly}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 items-end">
                                        <div>
                                            <Label htmlFor="location" value="Local" />
                                            <Input
                                                id="location"
                                                type="text"
                                                value={data.location}
                                                placeholder="São Paulo, SP"
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("location", e.target.value)}
                                                disabled={processing || readonly}
                                            />
                                        </div>

                                        <div>
                                            <Label value="Online" />
                                            <ToggleButton
                                                checked={data.is_online}
                                                onChange={(e) => setData("is_online", e.target.checked)}
                                                disabled={readonly}
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">Botão de ação (CTA)</p>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="cta_label" value="Texto do botão" />
                                                <Input
                                                    id="cta_label"
                                                    type="text"
                                                    value={data.cta_label}
                                                    placeholder="Garantir vaga"
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData("cta_label", e.target.value)}
                                                    disabled={processing || readonly}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="cta_style" value="Estilo" />
                                                <select
                                                    id="cta_style"
                                                    value={data.cta_style}
                                                    className={selectClass}
                                                    onChange={(e) => setData("cta_style", e.target.value)}
                                                    disabled={processing || readonly}
                                                >
                                                    {CTA_STYLE_OPTIONS.map((o) => (
                                                        <option key={o.value} value={o.value}>{o.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <Label htmlFor="cta_url" value="URL de inscrição" />
                                            <Input
                                                id="cta_url"
                                                type="url"
                                                value={data.cta_url}
                                                placeholder="https://exemplo.com/inscricao"
                                                className="mt-1 block w-full font-mono"
                                                onChange={(e) => setData("cta_url", e.target.value)}
                                                disabled={processing || readonly}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 items-end">
                                        <div>
                                            <Label htmlFor="seats" value="Vagas (descrição)" />
                                            <Input
                                                id="seats"
                                                type="text"
                                                value={data.seats}
                                                placeholder="Gratuito · inscrição aberta"
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("seats", e.target.value)}
                                                disabled={processing || readonly}
                                            />
                                        </div>

                                        <div>
                                            <Label value="Vagas limitadas" />
                                            <ToggleButton
                                                checked={data.seats_low}
                                                onChange={(e) => setData("seats_low", e.target.checked)}
                                                disabled={readonly}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 items-end">
                                        <div>
                                            <Label htmlFor="order" value="Ordem" />
                                            <Input
                                                id="order"
                                                type="number"
                                                min="0"
                                                value={data.order}
                                                className="mt-1 block w-32"
                                                onChange={(e) => setData("order", e.target.value === "" ? "" : Number(e.target.value))}
                                                disabled={processing || readonly}
                                            />
                                        </div>

                                        <div>
                                            <Label value="Ativo" />
                                            <ToggleButton
                                                checked={data.is_active}
                                                onChange={(e) => setData("is_active", e.target.checked)}
                                                disabled={readonly}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end mt-2">
                                        {!readonly && processing && <LoadingForm />}
                                        <NavButton
                                            href={route("admin.events.index")}
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
