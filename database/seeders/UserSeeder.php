<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Credenciais via env em produção (Railway); fallback só para dev/local.
        $admin = User::firstOrCreate(
            ['email' => env('SEED_ADMIN_EMAIL', 'admin@teste.com.br')],
            [
                'name' => 'Administrador',
                'password' => Hash::make(env('SEED_ADMIN_PASSWORD', 'Senha@123')),
                'is_super_admin' => true,
                'email_verified_at' => now(),
                'bio' => 'Administrador do site.',
            ]
        );
        $admin->assignRole('Administrador');

        $demo = User::firstOrCreate(
            ['email' => env('SEED_DEMO_EMAIL', 'demo@devhub.com')],
            [
                'name' => 'Demo',
                'password' => Hash::make(env('SEED_DEMO_PASSWORD', 'Demo@123')),
                'is_super_admin' => false,
                'email_verified_at' => now(),
            ]
        );
        $demo->assignRole('Visualizador');
    }
}
