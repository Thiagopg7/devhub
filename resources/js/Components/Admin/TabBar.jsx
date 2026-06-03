export default function TabBar({ tabs, active, onChange }) {
    return (
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onChange(tab.id)}
                    className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                        active === tab.id
                            ? 'border-red-600 text-red-600 dark:text-red-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
