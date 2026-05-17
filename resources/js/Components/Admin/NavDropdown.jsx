import { Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function NavDropdown({ label, active = false, children }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative flex items-center" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={
                    'inline-flex items-center gap-1 border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                    (active
                        ? 'border-indigo-400 text-gray-900 dark:text-gray-100'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200')
                }
            >
                {label}
                <ChevronDown
                    size={13}
                    className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div className="absolute top-full left-0 z-50 mt-1 w-44 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div
                        className="rounded-md bg-white dark:bg-gray-800 py-1"
                        onClick={() => setOpen(false)}
                    >
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

NavDropdown.Item = function NavDropdownItem({ href, active = false, children }) {
    return (
        <Link
            href={href}
            className={
                'block px-4 py-2 text-sm transition duration-150 ease-in-out ' +
                (active
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700')
            }
        >
            {children}
        </Link>
    );
};
