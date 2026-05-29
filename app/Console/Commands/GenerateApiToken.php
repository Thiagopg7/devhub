<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GenerateApiToken extends Command
{
    protected $signature = 'api:generate-token {name : Nome identificador do token} {--user= : ID ou e-mail do usuário dono do token}';

    protected $description = 'Gera um novo token de API (Sanctum) para um usuário';

    public function handle(): int
    {
        $identifier = $this->option('user');

        $user = $identifier
            ? User::where('email', $identifier)->orWhere('id', $identifier)->first()
            : User::orderBy('id')->first();

        if (! $user) {
            $this->error($identifier
                ? "Usuário '{$identifier}' não encontrado."
                : 'Nenhum usuário cadastrado para receber o token.');

            return self::FAILURE;
        }

        $token = $user->createToken($this->argument('name'))->plainTextToken;

        $this->info("Token gerado para {$user->email}.");
        $this->warn('Guarde agora — este valor não será exibido novamente:');
        $this->line($token);

        return self::SUCCESS;
    }
}
