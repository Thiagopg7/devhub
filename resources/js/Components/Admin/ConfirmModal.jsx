import Modal from '@/Components/Admin/Modal';

export default function ConfirmModal({ show, message, confirmLabel = 'Confirmar', onConfirm, onCancel }) {
    return (
        <Modal show={show} maxWidth="sm" onClose={onCancel}>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-red-500 transition"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
