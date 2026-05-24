<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
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
