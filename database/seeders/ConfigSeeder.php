<?php

namespace Database\Seeders;

use App\Models\Config;
use Illuminate\Database\Seeder;

class ConfigSeeder extends Seeder
{
    public function run(): void
    {
        $configs = [
            ['key' => 'site_name',            'group' => 'general',   'value' => 'DevHub'],
            ['key' => 'site_tagline',         'group' => 'general',   'value' => 'Blog e portfólio de desenvolvimento web'],
            ['key' => 'contact_email',        'group' => 'contact',   'value' => 'contato@devhub.com.br'],
            ['key' => 'contact_address',      'group' => 'contact',   'value' => 'Brasil'],
            ['key' => 'contact_address_link', 'group' => 'contact',   'value' => 'https://maps.app.goo.gl/xFe1sceNHV4QD93v6'],
            ['key' => 'footer_github',        'group' => 'footer',    'value' => 'https://github.com/thiagopg7'],
            ['key' => 'footer_linkedin',      'group' => 'footer',    'value' => 'https://www.linkedin.com/in/thiago-henrique-oliveira-de-jesus-358849209/'],
            ['key' => 'footer_facebook',      'group' => 'footer',    'value' => 'https://www.facebook.com/'],
            ['key' => 'footer_instagram',     'group' => 'footer',    'value' => 'http://instagram.com/'],
            ['key' => 'footer_youtube',       'group' => 'footer',    'value' => 'https://www.youtube.com/'],
            ['key' => 'footer_message',       'group' => 'footer',    'value' => '© 2026 DevHub. Feito com Laravel + React.'],
            ['key' => 'scripts_head',         'group' => 'scripts',   'value' => null],
            ['key' => 'scripts_body',         'group' => 'scripts',   'value' => null],
        ];

        foreach ($configs as $item) {
            Config::firstOrCreate(
                ['key' => $item['key']],
                ['group' => $item['group'], 'value' => $item['value']]
            );
        }
    }
}
