import { usePage } from '@inertiajs/react';

export function useCan() {
    const { isSuperAdmin = false, permissions = [] } = usePage().props.auth ?? {};

    return (permission) => {
        if (!permission) return true;
        if (isSuperAdmin) return true;
        if (Array.isArray(permission)) {
            return permission.some((p) => permissions.includes(p));
        }
        return permissions.includes(permission);
    };
}
