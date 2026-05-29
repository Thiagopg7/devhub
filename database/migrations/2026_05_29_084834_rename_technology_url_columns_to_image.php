<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('technologies', function (Blueprint $table) {
            $table->renameColumn('icon_url', 'icon_image');
            $table->renameColumn('screenshot_url', 'screenshot_image');
        });
    }

    public function down(): void
    {
        Schema::table('technologies', function (Blueprint $table) {
            $table->renameColumn('icon_image', 'icon_url');
            $table->renameColumn('screenshot_image', 'screenshot_url');
        });
    }
};
