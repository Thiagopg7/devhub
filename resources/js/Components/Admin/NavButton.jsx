import { Link } from '@inertiajs/react'
import clsx from 'clsx'

const variants = {
    primary:   'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-400',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400',
};

export default function NavButton({ href, variant = 'primary', className = '', children, ...props }) {
    return (
        <Link
            href={href}
            className={clsx(
                'inline-flex items-center px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-widest outline-none transition-colors duration-200',
                variants[variant] ?? variants.primary,
                className
            )}
            {...props}
        >
            {children}
        </Link>
    )
}
