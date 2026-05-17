export default function Label({ value, children, ...props }) {
    return (
        <label
            {...props}
            className={`block font-medium text-sm text-gray-700 dark:text-gray-300 ${props.className || ''}`}
        >
            {value ? value : children}
        </label>
    );
}
