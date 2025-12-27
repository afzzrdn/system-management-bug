<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Ensure status can store new values (pending/closed) by widening to string
        if (Schema::hasColumn('bugs', 'status')) {
            // Drop old enum/check constraint so we can allow pending/closed
            DB::statement("ALTER TABLE bugs DROP CONSTRAINT IF EXISTS bugs_status_check");
            DB::statement("ALTER TABLE bugs ALTER COLUMN status DROP DEFAULT");
            DB::statement("ALTER TABLE bugs ALTER COLUMN status TYPE varchar(20) USING status::text");
            DB::statement("UPDATE bugs SET status = 'pending' WHERE status IS NULL");
            DB::statement("ALTER TABLE bugs ALTER COLUMN status SET DEFAULT 'pending'");
        }

        Schema::table('bugs', function (Blueprint $table) {
            if (!Schema::hasColumn('bugs', 'ticket_number')) {
                $table->string('ticket_number')->unique()->after('id');
            }

            if (!Schema::hasColumn('bugs', 'is_approved')) {
                $table->boolean('is_approved')->default(false)->after('status');
            }

            if (!Schema::hasColumn('bugs', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('is_approved');
            }

            if (!Schema::hasColumn('bugs', 'approved_by')) {
                $table->uuid('approved_by')->nullable()->after('approved_at');
                $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('bugs', function (Blueprint $table) {
            if (Schema::hasColumn('bugs', 'approved_by')) {
                $table->dropForeign(['approved_by']);
                $table->dropColumn('approved_by');
            }
            if (Schema::hasColumn('bugs', 'approved_at')) {
                $table->dropColumn('approved_at');
            }
            if (Schema::hasColumn('bugs', 'is_approved')) {
                $table->dropColumn('is_approved');
            }
            if (Schema::hasColumn('bugs', 'ticket_number')) {
                $table->dropColumn('ticket_number');
            }
        });

        // Revert status default (note: original enum type cannot be restored automatically)
        if (Schema::hasColumn('bugs', 'status')) {
            DB::statement("ALTER TABLE bugs DROP CONSTRAINT IF EXISTS bugs_status_check");
            DB::statement("ALTER TABLE bugs ALTER COLUMN status DROP DEFAULT");
            DB::statement("UPDATE bugs SET status = 'open' WHERE status IS NULL");
            DB::statement("ALTER TABLE bugs ALTER COLUMN status SET DEFAULT 'open'");
        }
    }
};
