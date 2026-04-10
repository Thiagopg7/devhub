import { Link } from '@inertiajs/react'
import clsx from 'clsx' // ajuda a combinar classes

export default function NavButton({ href, className = '', children, ...props }) {
    return (
        <Link
            href={href}
            className={clsx(
                'inline-flex items-center px-4 py-2 rounded-md outline-none transition-colors duration-200',
                'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-400',
                className
            )}
            {...props}
        >
            {children}
        </Link>
    )
}
