<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Verifica campanhas agendadas a cada minuto e enfileira as que venceram
Schedule::command('newsletter:dispatch-scheduled')
    ->everyMinute()
    ->withoutOverlapping()
    ->runInBackground();

// Remove logs de envio com mais de 6 meses (LGPD — minimização de dados)
Schedule::command('model:prune', ['--model' => 'App\\Models\\NewsletterSendLog'])
    ->monthly();
