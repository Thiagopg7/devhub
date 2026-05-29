import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Users, Mail, Megaphone, Activity, ArrowRight } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color, href }) {
    const content = (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 hover:shadow-md transition-shadow h-full">
            <div className={`p-3 rounded-lg shrink-0 ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub ?? ' '}</p>
            </div>
            {href && <ArrowRight size={16} className="text-gray-400 flex-shrink-0" />}
        </div>
    );

    return href ? <Link href={href} className="h-full block">{content}</Link> : content;
}

function ActivityBadge({ description }) {
    const map = {
        created: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
        updated: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        deleted: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    };
    const cls = map[description] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    return (
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
            {description}
        </span>
    );
}

export default function Dashboard({ stats, postsPerMonth, recentActivity }) {
    const maxPosts = Math.max(...(postsPerMonth?.map(p => p.total) ?? [1]), 1);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">

                {/* Cards de estatísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={FileText}
                        label="Posts publicados"
                        value={stats.posts.active}
                        sub={`${stats.posts.total} no total`}
                        color="bg-sky-500"
                        href={route('admin.posts.index')}
                    />
                    <StatCard
                        icon={Users}
                        label="Usuários"
                        value={stats.users}
                        color="bg-violet-500"
                        href={route('admin.users.index')}
                    />
                    <StatCard
                        icon={Mail}
                        label="Assinantes newsletter"
                        value={stats.subscribers}
                        sub="com consentimento LGPD"
                        color="bg-emerald-500"
                        href={route('admin.newsletter-subscribers.index')}
                    />
                    <StatCard
                        icon={Megaphone}
                        label="Campanhas"
                        value={stats.campaigns}
                        color="bg-amber-500"
                        href={route('admin.newsletter-campaigns.index')}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Gráfico de posts por mês */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                            Posts criados — últimos 6 meses
                        </h3>
                        {postsPerMonth?.length > 0 ? (
                            <div className="flex items-end gap-2 h-32">
                                {postsPerMonth.map((item) => (
                                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-xs text-gray-400">{item.total}</span>
                                        <div
                                            className="w-full bg-sky-500 rounded-t-sm transition-all"
                                            style={{ height: `${(item.total / maxPosts) * 100}%`, minHeight: '4px' }}
                                        />
                                        <span className="text-xs text-gray-400 truncate w-full text-center">
                                            {item.month.slice(5)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                                Nenhum post nos últimos 6 meses.
                            </p>
                        )}
                    </div>

                    {/* Atividade recente */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Atividade recente
                            </h3>
                            <Link
                                href={route('admin.activity-log.index')}
                                className="text-xs text-sky-500 hover:text-sky-600 flex items-center gap-1"
                            >
                                Ver tudo <ArrowRight size={12} />
                            </Link>
                        </div>

                        {recentActivity?.length > 0 ? (
                            <ul className="space-y-3">
                                {recentActivity.map((item) => (
                                    <li key={item.id} className="flex items-center gap-3 text-sm">
                                        <Activity size={14} className="text-gray-400 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                {item.causer}
                                            </span>
                                            <span className="text-gray-400 mx-1">·</span>
                                            <ActivityBadge description={item.description} />
                                            <span className="text-gray-400 mx-1">·</span>
                                            <span className="text-gray-500 dark:text-gray-400">{item.subject}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 flex-shrink-0">{item.created_at}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                Nenhuma atividade registrada.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
