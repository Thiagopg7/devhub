<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->index(['is_active', 'created_at']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index('is_active');
        });

        Schema::table('technologies', function (Blueprint $table) {
            $table->index('is_active');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['is_active', 'created_at']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
        });

        Schema::table('technologies', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
        });
    }
};
