<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'thiago@teste.com.br'],
            [
                'name' => 'Thiago Henrique',
                'password' => Hash::make('Senha@123'),
                'is_super_admin' => true,
                'email_verified_at' => now(),
                'bio' => 'Desenvolvedor full-stack apaixonado por PHP, Laravel e React. Escreve sobre arquitetura, boas práticas e as ferramentas que usa no dia a dia para construir produtos de verdade.',
            ]
        );
        $admin->assignRole('Administrador');

        $demo = User::firstOrCreate(
            ['email' => 'demo@devhub.com'],
            [
                'name' => 'Demo',
                'password' => Hash::make('Demo@123'),
                'is_super_admin' => false,
                'email_verified_at' => now(),
            ]
        );
        $demo->assignRole('Visualizador');
    }
}
