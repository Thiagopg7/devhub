export default function ActionButton({
    type = 'submit',
    theme = 'default',
    colorClasses = 'bg-w6 text-black hover:bg-w6-600 active:bg-w6-800 focus:border-w6-400 focus:ring-w6-400',
    className = '',
    children,
    ...props
}) {
    const themeSchema = () => {
        if (theme === 'danger') {
            return 'bg-red-400 hover:bg-red-500 hover:text-white';
        } else if (theme === 'light') {
            return 'bg-red-600 text-gray-400 hover:bg-gray-400 hover:text-gray-500 active:bg-gray-400 active:text-white focus:border-gray-500 focus:ring-gray-500';
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
