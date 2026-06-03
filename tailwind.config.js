import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans:    ['Manrope', ...defaultTheme.fontFamily.sans],
                display: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
                mono:    ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                base:       'var(--base)',
                panel:      'var(--panel)',
                surface:    'var(--surface)',
                'surface-2': 'var(--surface-2)',
                'surface-3': 'var(--surface-3)',
                accent: {
                    DEFAULT: 'var(--accent)',
                    2:       'var(--accent-2)',
                    ink:     'var(--accent-ink)',
                    hi:      'var(--accent-hi)',
                },
                violet:  'var(--violet)',
                teal:    'var(--teal)',
                gold:    'var(--gold)',
                bright:  'var(--text-bright)',
                body:    'var(--text-body)',
                muted:   'var(--text-muted)',
                line: {
                    DEFAULT: 'var(--border)',
                    2:       'var(--border-2)',
                    s:       'var(--border-s)',
                    faint:   'var(--border-faint)',
                    h:       'var(--border-h)',
                },
                // legado — mantido p/ compatibilidade
                hub: {
                    bg:      'var(--base)',
                    bgalt:   'var(--panel)',
                    surface: 'var(--surface)',
                    s2:      'var(--surface-2)',
                    s3:      'var(--surface-3)',
                },
            },
        },
    },

    plugins: [forms, typography],
};
