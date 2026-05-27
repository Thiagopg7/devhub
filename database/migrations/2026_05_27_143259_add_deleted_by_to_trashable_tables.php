<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['posts', 'categories', 'pages'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignId('deleted_by')->nullable()->after('deleted_at')
                    ->constrained('users')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        foreach (['posts', 'categories', 'pages'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                $table->dropForeign(["{$tableName}_deleted_by_foreign"]);
                $table->dropColumn('deleted_by');
            });
        }
    }
};
