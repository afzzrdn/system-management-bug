<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('bugs', function (Blueprint $table) {
            if (!Schema::hasColumn('bugs', 'approval_reminder_sent_at')) {
                $table->timestamp('approval_reminder_sent_at')->nullable()->after('approved_by');
            }
            if (!Schema::hasColumn('bugs', 'approval_canceled_at')) {
                $table->timestamp('approval_canceled_at')->nullable()->after('approval_reminder_sent_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('bugs', function (Blueprint $table) {
            if (Schema::hasColumn('bugs', 'approval_canceled_at')) {
                $table->dropColumn('approval_canceled_at');
            }
            if (Schema::hasColumn('bugs', 'approval_reminder_sent_at')) {
                $table->dropColumn('approval_reminder_sent_at');
            }
        });
    }
};
