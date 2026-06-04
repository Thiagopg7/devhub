<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type'); // conf, meetup, workshop, hack
            $table->string('org');
            $table->date('date');
            $table->string('time')->nullable();
            $table->string('location')->nullable();
            $table->boolean('is_online')->default(false);
            $table->string('status')->default('open'); // open, soon, full
            $table->string('cta_label')->nullable();
            $table->string('cta_style')->default('primary'); // primary, ghost
            $table->string('cta_url')->nullable();
            $table->string('seats')->nullable();
            $table->boolean('seats_low')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
