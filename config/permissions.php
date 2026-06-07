<?php

/*
 * Lista de módulos do painel admin.
 * Cada módulo gera 4 permissions: {modulo}.view, {modulo}.create, {modulo}.edit, {modulo}.delete
 *
 * O seeder PermissionsSeeder consome esta lista, e o front (Roles/Form) usa para
 * montar a matriz de checkboxes.
 */
return [
    'modules' => [
        'posts' => 'Posts',
        'categories' => 'Categorias',
        'blocks' => 'Blocos',
        'pages' => 'Páginas',
        'menu' => 'Menu',
        'technologies' => 'Tecnologias',
        'events' => 'Eventos',
        'testimonials' => 'Depoimentos',
        'stack' => 'Stack (tecnologias)',
        'configs' => 'Configurações',
        'newsletter_areas' => 'Áreas de newsletter',
        'newsletter_subscribers' => 'Inscritos da newsletter',
        'newsletter_campaigns' => 'Campanhas de newsletter',
        'users' => 'Usuários',
        'roles' => 'Perfis',
        'activity_log' => 'Logs de atividade',
    ],

    'actions' => ['view', 'create', 'edit', 'delete'],

    // Permissions extras por módulo que não seguem o padrão de actions global
    'module_extras' => [
        'newsletter_campaigns' => ['send'],
    ],
];
