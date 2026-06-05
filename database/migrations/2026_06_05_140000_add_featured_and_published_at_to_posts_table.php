<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('is_active');
            $table->timestamp('published_at')->nullable()->after('is_featured');

            $table->index('is_featured');
            $table->index('published_at');
        });

        // Posts existentes passam a ter a data de publicação igual à de criação.
        DB::table('posts')->whereNull('published_at')->update([
            'published_at' => DB::raw('created_at'),
        ]);
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['published_at']);
            $table->dropColumn(['is_featured', 'published_at']);
        });
    }
};
