import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (links.length <= 3) return null;

    return (
        <div className="w-full flex flex-row justify-center items-center flex-wrap gap-1">
            {links.map((link, key) => (
                <div key={key} className="text-base">
                    {link.url === null ? (
                        <span
                            className="px-4 py-2 text-gray-400 border rounded-md cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            href={link.url}
                            className={`px-4 py-2 border rounded-md hover:border-gray-600 ${
                                link.active ? 'bg-purple-bg text-white' : ''
                            }`}
                            as="button"
                            type="button"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
