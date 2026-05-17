export default function ActionButton({
    type = 'submit',
    theme = 'default',
    colorClasses = 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:border-red-400 focus:ring-red-400',
    className = '',
    children,
    ...props
}) {
    const themeSchema = () => {
        if (theme === 'danger') {
            return 'bg-red-400 hover:bg-red-500 hover:text-white';
        } else if (theme === 'light') {
            return 'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 focus:border-gray-400 focus:ring-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500';
        } else {
            return colorClasses;
        }
    };

    return (
        <button
            type={type}
            className={`inline-flex items-center px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none disabled:opacity-25 transition ${themeSchema()} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
