<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * IMPORTANTE — contrato de idempotência:
     * Este seed roda em TODO deploy (ver docker/start.sh) e é idempotente via
     * firstOrCreate, usando nome/título como chave de busca. Portanto:
     *
     *  - O conteúdo seedado é CANÔNICO: a fonte da verdade é este código, não o
     *    painel admin. Para alterar um item permanentemente, edite o seeder.
     *  - NÃO renomeie pelo admin um item criado aqui (post, categoria, evento…):
     *    o seed não o reconhece mais pelo nome antigo e cria uma DUPLICATA no
     *    próximo deploy. Itens novos criados só no admin (com nomes diferentes)
     *    convivem sem conflito.
     */
    public function run(): void
    {
        $this->call([
            PermissionsSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            PostSeeder::class,
            PageSeeder::class,
            TechnologySeeder::class,
            NewsletterAreaSeeder::class,
            ConfigSeeder::class,
            MenuSeeder::class,
            EventSeeder::class,
            TestimonialSeeder::class,
            StackItemSeeder::class,
        ]);
    }
}
