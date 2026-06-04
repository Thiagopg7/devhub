import ApplicationLogo from '@/Components/Admin/ApplicationLogo';
import Dropdown from '@/Components/Admin/Dropdown';
import NavDropdown from '@/Components/Admin/NavDropdown';
import NavLink from '@/Components/Admin/NavLink';
import ResponsiveNavLink from '@/Components/Admin/ResponsiveNavLink';
import ThemeToggle from '@/Components/Admin/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { useCan } from '@/hooks/useCan';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { toast: toastProps } = usePage().props;
    const { theme, toggleTheme } = useTheme();
    const can = useCan();

    useEffect(() => {
        if (toastProps) {
            toast[toastProps.type](`${toastProps.title} - ${toastProps.message}`);
        }
    }, [toastProps]);

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const groups = useMemo(() => [
        {
            label: 'Posts',
            items: [
                { permission: 'posts.view',      label: 'Posts',      routeName: 'admin.posts.index',      activePattern: 'admin.posts.*' },
                { permission: 'categories.view', label: 'Categorias', routeName: 'admin.categories.index', activePattern: 'admin.categories.*' },
            ],
        },
        {
            label: 'Conteúdo',
            items: [
                { permission: 'blocks.view',       label: 'Blocos',      routeName: 'admin.blocks.index',       activePattern: 'admin.blocks.*' },
                { permission: 'pages.view',        label: 'Páginas',     routeName: 'admin.pages.index',        activePattern: 'admin.pages.*' },
                { permission: 'menu.view',         label: 'Menu',        routeName: 'admin.menu.index',         activePattern: 'admin.menu.*' },
                { permission: 'technologies.view', label: 'Tecnologias', routeName: 'admin.technologies.index', activePattern: 'admin.technologies.*' },
                { permission: 'events.view',       label: 'Eventos',     routeName: 'admin.events.index',       activePattern: 'admin.events.*' },
                { permission: 'testimonials.view', label: 'Depoimentos', routeName: 'admin.testimonials.index', activePattern: 'admin.testimonials.*' },
            ],
        },
        {
            label: 'Newsletter',
            items: [
                { permission: 'newsletter_areas.view',       label: 'Áreas',      routeName: 'admin.newsletter-areas.index',       activePattern: 'admin.newsletter-areas.*' },
                { permission: 'newsletter_subscribers.view', label: 'Inscritos',  routeName: 'admin.newsletter-subscribers.index', activePattern: 'admin.newsletter-subscribers.*' },
                { permission: 'newsletter_campaigns.view',   label: 'Campanhas',  routeName: 'admin.newsletter-campaigns.index',   activePattern: 'admin.newsletter-campaigns.*' },
            ],
        },
        {
            label: 'Sistema',
            items: [
                { permission: 'users.view',        label: 'Usuários',          routeName: 'admin.users.index',        activePattern: 'admin.users.*' },
                { permission: 'roles.view',        label: 'Perfis',            routeName: 'admin.roles.index',        activePattern: 'admin.roles.*' },
                { permission: 'configs.view',      label: 'Configurações',     routeName: 'admin.configs.edit',       activePattern: 'admin.configs.*' },
                { permission: 'activity_log.view', label: 'Logs de atividade', routeName: 'admin.activity-log.index', activePattern: 'admin.activity-log.*' },
            ],
        },
    ], []);

    const visibleGroups = useMemo(
        () => groups
            .map((g) => ({ ...g, items: g.items.filter((i) => can(i.permission) && routeExists(i.routeName)) }))
            .filter((g) => g.items.length > 0),
        [groups, can],
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="border-b border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            <div className="hidden space-x-6 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('admin.dashboard')}
                                    active={route().current('admin.dashboard')}
                                >
                                    Dashboard
                                </NavLink>

                                {visibleGroups.map((group) => (
                                    group.items.length === 1 ? (
                                        <NavLink
                                            key={group.items[0].routeName}
                                            href={route(group.items[0].routeName)}
                                            active={route().current(group.items[0].activePattern)}
                                        >
                                            {group.items[0].label}
                                        </NavLink>
                                    ) : (
                                        <NavDropdown
                                            key={group.label}
                                            label={group.label}
                                            active={group.items.some((i) => route().current(i.activePattern))}
                                        >
                                            {group.items.map((item) => (
                                                <NavDropdown.Item
                                                    key={item.routeName}
                                                    href={route(item.routeName)}
                                                    active={route().current(item.activePattern)}
                                                >
                                                    {item.label}
                                                </NavDropdown.Item>
                                            ))}
                                        </NavDropdown>
                                    )
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center gap-2">
                            <ThemeToggle theme={theme} onToggle={toggleTheme} />

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-gray-400 transition duration-150 ease-in-out hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center gap-2 sm:hidden">
                            <ThemeToggle theme={theme} onToggle={toggleTheme} />

                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown((prev) => !prev)
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-500 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-300 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'
                    }
                >
                    <div className="pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('admin.dashboard')}
                            active={route().current('admin.dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>

                        {visibleGroups.map((group) => (
                            <div key={group.label}>
                                <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                                    {group.label}
                                </p>
                                {group.items.map((item) => (
                                    <ResponsiveNavLink
                                        key={item.routeName}
                                        href={route(item.routeName)}
                                        active={route().current(item.activePattern)}
                                    >
                                        {item.label}
                                    </ResponsiveNavLink>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-100">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}

function routeExists(name) {
    try {
        return typeof route().has === 'function' ? route().has(name) : true;
    } catch {
        return false;
    }
}
