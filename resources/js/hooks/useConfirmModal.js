import { useState } from "react";

export function useConfirmModal() {
    const [pending, setPending] = useState(null);

    const confirm = (config) => setPending(config);

    const modalProps = {
        show: !!pending,
        message: pending?.message,
        onConfirm: () => { pending?.onConfirm?.(); setPending(null); },
        onCancel:  () => setPending(null),
    };

    return { confirm, modalProps };
}
