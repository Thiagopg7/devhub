import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ToggleActive({ id, model, value }) {
    const [isActive, setIsActive] = useState(value);
    const [loading, setLoading] = useState(false);

    async function toggle() {
        if (loading) return;
        setLoading(true);

        router.post(
            route("admin.toggle.active"),
            { id, model, is_active: !isActive },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    setIsActive(!isActive);
                    toast.success("Status atualizado!");
                },
                onError: () => toast.error("Erro ao atualizar status."),
                onFinish: () => setLoading(false),
            }
        );
    }

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={loading}
            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                isActive ? "bg-green-500" : "bg-gray-400"
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    isActive ? "translate-x-6" : "translate-x-1"
                }`}
            ></span>
            {loading && (
                <FaSpinner className="absolute right-[-20px] animate-spin text-gray-500" />
            )}
        </button>
    );
}
