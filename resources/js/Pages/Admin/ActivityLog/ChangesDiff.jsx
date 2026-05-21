export default function ChangesDiff({ changes }) {
    if (!changes || (!changes.old && !changes.attributes)) {
        return <p className="text-sm text-gray-500 dark:text-gray-400 italic">Sem detalhes registrados.</p>;
    }

    const oldValues = changes.old ?? {};
    const newValues = changes.attributes ?? {};
    const keys = Array.from(new Set([...Object.keys(oldValues), ...Object.keys(newValues)]));

    const fmt = (val) => {
        if (val === null || val === undefined) return <span className="italic text-gray-400">null</span>;
        if (typeof val === 'object') return <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(val, null, 2)}</pre>;
        return String(val);
    };

    return (
        <table className="w-full text-sm border-collapse">
            <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                    <th className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-300 w-1/4">Campo</th>
                    <th className="px-3 py-2 font-semibold text-red-600 dark:text-red-400 w-[37.5%]">Antes</th>
                    <th className="px-3 py-2 font-semibold text-green-600 dark:text-green-400 w-[37.5%]">Depois</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {keys.map((key) => (
                    <tr key={key} className="align-top">
                        <td className="px-3 py-2 font-mono text-xs text-gray-600 dark:text-gray-300">{key}</td>
                        <td className="px-3 py-2 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/10">
                            {fmt(oldValues[key])}
                        </td>
                        <td className="px-3 py-2 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/10">
                            {fmt(newValues[key])}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
