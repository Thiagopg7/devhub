<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('newsletter_send_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('newsletter_campaign_id')
                ->constrained('newsletter_campaigns')
                ->cascadeOnDelete();
            $table->foreignId('newsletter_subscriber_id')
                ->constrained('newsletter_subscribers')
                ->cascadeOnDelete();
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');
            $table->text('error')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->unique(['newsletter_campaign_id', 'newsletter_subscriber_id'], 'nsl_campaign_subscriber_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newsletter_send_logs');
    }
};
