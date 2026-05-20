<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'thiago@teste.com.br'],
            [
                'name' => 'Thiago Henrique',
                'password' => Hash::make('Senha@123'),
                'is_super_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        $user->assignRole('Administrador');
    }
}
