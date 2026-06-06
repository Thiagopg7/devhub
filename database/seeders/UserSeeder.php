<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminEmail = env('SEED_ADMIN_EMAIL');
        $adminPassword = env('SEED_ADMIN_PASSWORD');

        // Em produção é proibido cair no fallback fraco: aborta o deploy se as
        // credenciais do super-admin não estiverem definidas no ambiente.
        if (app()->environment('production') && (! $adminEmail || ! $adminPassword)) {
            throw new \RuntimeException(
                'SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD precisam estar definidos em produção. '
                .'Configure-os nas variáveis de ambiente (Railway) antes do deploy.'
            );
        }

        $admin = User::firstOrCreate(
            ['email' => $adminEmail ?: 'admin@teste.com.br'],
            [
                'name' => 'Administrador',
                'password' => Hash::make($adminPassword ?: 'Senha@123'),
                'is_super_admin' => true,
                'email_verified_at' => now(),
                'bio' => 'Administrador do site.',
            ]
        );
        $admin->assignRole('Administrador');

        $demoEmail = env('SEED_DEMO_EMAIL');
        $demoPassword = env('SEED_DEMO_PASSWORD');

        // Conta demo é opcional: em produção só é criada se as credenciais forem
        // definidas no ambiente; caso contrário é pulada (nunca usa senha fraca).
        if (app()->environment('production') && (! $demoEmail || ! $demoPassword)) {
            return;
        }

        $demo = User::firstOrCreate(
            ['email' => $demoEmail ?: 'demo@devhub.com'],
            [
                'name' => 'Demo',
                'password' => Hash::make($demoPassword ?: 'Demo@123'),
                'is_super_admin' => false,
                'email_verified_at' => now(),
            ]
        );
        $demo->assignRole('Visualizador');
    }
}
