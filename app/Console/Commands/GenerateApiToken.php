<?php

namespace App\Console\Commands;

use App\Models\ApiToken;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateApiToken extends Command
{
    protected $signature   = 'api:generate-token {name : Nome identificador do token}';
    protected $description = 'Gera um novo token de API e salva o hash no banco';

    public function handle(): int
    {
        $plainToken = Str::random(64);
        $hash       = hash('sha256', $plainToken);

        ApiToken::create([
            'name'       => $this->argument('name'),
            'token_hash' => $hash,
        ]);

        $this->info('Token gerado com sucesso!');
        $this->warn('Guarde agora — este valor não será exibido novamente:');
        $this->line($plainToken);

        return self::SUCCESS;
    }
}
