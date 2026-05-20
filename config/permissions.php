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
        'posts'                  => 'Posts',
        'categories'             => 'Categorias',
        'blocks'                 => 'Blocos',
        'pages'                  => 'Páginas',
        'menu'                   => 'Menu',
        'technologies'           => 'Tecnologias',
        'configs'                => 'Configurações',
        'newsletter_areas'       => 'Áreas de newsletter',
        'newsletter_subscribers' => 'Inscritos da newsletter',
        'users'                  => 'Usuários',
        'roles'                  => 'Perfis',
    ],

    'actions' => ['view', 'create', 'edit', 'delete'],
];
