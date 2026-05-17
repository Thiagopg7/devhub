import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function SortableTr({ id, disabled = false, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled });

    return (
        <tr
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={isDragging ? "opacity-40 bg-gray-50 dark:bg-gray-700/60 shadow-lg relative z-10" : ""}
        >
            <td className="pl-3 pr-1 py-4 w-8">
                <button
                    type="button"
                    title={disabled ? "Limpe a busca para reordenar" : "Arrastar para reordenar"}
                    className={`touch-none ${
                        disabled
                            ? "text-gray-200 dark:text-gray-700 cursor-not-allowed"
                            : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
                    }`}
                    {...(disabled ? {} : { ...attributes, ...listeners })}
                >
                    <GripVertical size={16} />
                </button>
            </td>
            {children}
        </tr>
    );
}
