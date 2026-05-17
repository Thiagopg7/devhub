import { useState, useRef } from "react";
import { Trash2, Upload, ImageOff } from "lucide-react";
import Label from "@/Components/Admin/Label";

export default function ImageSlot({ label, currentUrl, onDelete, fieldName, onChange, processing }) {
    const inputRef = useRef();
    const [preview, setPreview] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        onChange(fieldName, file);
    };

    const displayed = preview || currentUrl;

    return (
        <div>
            <Label value={label} />
            <div className="mt-2 flex flex-col gap-3">
                {displayed ? (
                    <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <img
                            src={displayed}
                            alt={label}
                            className="w-full max-h-48 object-cover"
                        />
                        {currentUrl && !preview && (
                            <button
                                type="button"
                                onClick={onDelete}
                                disabled={processing}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                                title="Remover imagem"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <ImageOff size={28} />
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={processing}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <Upload size={14} />
                    {displayed ? "Trocar imagem" : "Selecionar imagem"}
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                />
            </div>
        </div>
    );
}
