import { usePage } from '@inertiajs/react';

export default function ValidationErrors({ className = '' }) {
    const { props } = usePage();
    const errors = props.errors || {};

    const hasErrors = Object.keys(errors).length > 0;

    if (!hasErrors) {
        return null;
    }

    return (
        <div className={className}>
            <div className="font-medium text-red-600">Oops! Ocorreu um erro.</div>

            <ul className="mt-3 list-disc list-inside text-sm text-red-600">
                {Object.entries(errors).map(([key, error]) => (
                    <li key={key}>{error}</li>
                ))}
            </ul>
        </div>
    );
}
