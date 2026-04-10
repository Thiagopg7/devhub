export default function Label({ value, children, ...props }) {
    return (
        <label
            {...props}
            className={`block font-medium text-sm text-gray-700 ${props.className || ''}`}
        >
            {value ? value : children}
        </label>
    );
}
