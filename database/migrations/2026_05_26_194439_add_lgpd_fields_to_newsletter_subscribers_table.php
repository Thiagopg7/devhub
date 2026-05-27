<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->boolean('lgpd_consent')->default(false)->after('ip_address');
            $table->timestamp('lgpd_consent_at')->nullable()->after('lgpd_consent');
            $table->string('unsubscribe_token', 64)->unique()->nullable()->after('lgpd_consent_at');
        });
    }

    public function down(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropColumn(['lgpd_consent', 'lgpd_consent_at', 'unsubscribe_token']);
        });
    }
};
