<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('bugs', function (Blueprint $table) {
            $table->timestampTz('schedule_start_at')->nullable();
            $table->timestampTz('due_at')->nullable();
            $table->text('delay_reason')->nullable();
            $table->timestampTz('overdue_notified_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('bugs', function (Blueprint $table) {
            $table->dropColumn(['schedule_start_at','due_at','delay_reason','overdue_notified_at']);
        });
    }
};
