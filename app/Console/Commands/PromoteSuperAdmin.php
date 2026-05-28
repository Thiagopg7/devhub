<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class PromoteSuperAdmin extends Command
{
    protected $signature = 'app:promote-super-admin {email}';

    protected $description = 'Promove um usuário existente a super admin (acesso total ao painel).';

    public function handle(): int
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("Usuário com e-mail {$email} não encontrado.");

            return self::FAILURE;
        }

        if ($user->isSuperAdmin()) {
            $this->info("Usuário {$user->name} já é super admin.");

            return self::SUCCESS;
        }

        $user->update(['is_super_admin' => true]);

        $this->info("Usuário {$user->name} promovido a super admin.");

        return self::SUCCESS;
    }
}
