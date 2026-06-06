<?php

namespace Database\Seeders;

use App\Models\StackItem;
use Illuminate\Database\Seeder;

class StackItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'name' => 'Laravel',
                'icon' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 5l4 2v8l5 3 5-3V9l-5-3 5-3 4 2"/></svg>',
            ],
            [
                'name' => 'React',
                'icon' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>',
            ],
            [
                'name' => 'Inertia.js',
                'icon' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
            ],
            [
                'name' => 'Tailwind CSS',
                'icon' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 9C8 6 10 5 12.5 6c1.5.6 2 1.7 3.2 2.6 1.3 1 2.8 1 4.3-.3-1.5 3-3.5 4-6 3-1.5-.6-2-1.7-3.2-2.6C9.5 7.7 8 7.7 6.5 9zM2 14.4c1.5-3 3.5-4 6-3 1.5.6 2 1.7 3.2 2.6 1.3 1 2.8 1 4.3-.3-1.5 3-3.5 4-6 3-1.5-.6-2-1.7-3.2-2.6-1.3-1-2.8-1-4.3.3z"/></svg>',
            ],
            [
                'name' => 'TypeScript',
                'icon' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 11h5M11.5 11v6M14.5 16.5c.6.6 3 1 3-.8 0-1.8-2.8-1.2-2.8-3 0-1.4 2.2-1.4 2.8-.5"/></svg>',
            ],
            [
                'name' => 'PHP',
                'icon' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="12" cy="12" rx="10" ry="6"/><path d="M7 10l-1 5M6.5 12.5h1.3c.8 0 1.2-.5 1-1.3-.1-.6-.6-.7-1.2-.7H7M16 10l-1 5M15.5 12.5h1.3c.8 0 1.2-.5 1-1.3-.1-.6-.6-.7-1.2-.7H16M11 9.5l-1.2 6M10.4 12h1.5c.8 0 1.3.4 1.1 1.4l-.3 1.6"/></svg>',
            ],
            [
                'name' => 'PostgreSQL',
                'icon' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/></svg>',
            ],
            [
                'name' => 'Docker',
                'icon' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="11" width="3" height="3"/><rect x="7" y="11" width="3" height="3"/><rect x="11" y="11" width="3" height="3"/><rect x="7" y="7" width="3" height="3"/><rect x="11" y="7" width="3" height="3"/><path d="M2 14c3 3 13 3 16-1 .5 1 1.5 1 2 0M16 7c1.2 0 1.5 1 1.2 2"/></svg>',
            ],
            [
                'name' => 'Vite',
                'icon' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 5l9 16 9-16-9 3z"/><path d="M13 7l-3 6 3-1-1 4"/></svg>',
            ],
            [
                'name' => 'Node.js',
                'icon' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M9 15c0 1 .8 1.5 2 1.5 1.5 0 2.2-.6 2.2-1.6 0-2.2-4-.9-4-2.8 0-.9.8-1.4 2-1.4 1 0 1.7.3 2 1"/></svg>',
            ],
            [
                'name' => 'Redis',
                'icon' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M3 7l9-3 9 3-9 3z"/><path d="M3 12l9 3 9-3M3 17l9 3 9-3"/></svg>',
            ],
        ];

        foreach ($items as $order => $data) {
            StackItem::firstOrCreate(
                ['name' => $data['name']],
                [
                    ...$data,
                    'order' => $order + 1,
                    'is_active' => true,
                ]
            );
        }
    }
}
