<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('attachments')) {
            Schema::create('attachments', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('bug_id');
                $table->uuid('uploaded_by')->nullable();
                $table->string('file_path');
                $table->string('file_name')->nullable();
                $table->string('mime')->nullable();
                $table->unsignedBigInteger('size')->nullable();
                $table->timestamps();

                $table->foreign('bug_id')->references('id')->on('bugs')->onDelete('cascade');
                $table->foreign('uploaded_by')->references('id')->on('users')->nullOnDelete();
            });
            return;
        }

        Schema::table('attachments', function (Blueprint $table) {
            if (!Schema::hasColumn('attachments', 'bug_id')) {
                $table->uuid('bug_id')->after('id');
                $table->foreign('bug_id')->references('id')->on('bugs')->onDelete('cascade');
            }
            if (!Schema::hasColumn('attachments', 'uploaded_by')) {
                $table->uuid('uploaded_by')->nullable()->after('bug_id');
                $table->foreign('uploaded_by')->references('id')->on('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('attachments', 'file_path')) {
                $table->string('file_path')->after('uploaded_by');
            }
            if (!Schema::hasColumn('attachments', 'file_name')) {
                $table->string('file_name')->nullable()->after('file_path');
            }
            if (!Schema::hasColumn('attachments', 'mime')) {
                $table->string('mime')->nullable()->after('file_name');
            }
            if (!Schema::hasColumn('attachments', 'size')) {
                $table->unsignedBigInteger('size')->nullable()->after('mime');
            }
            if (!Schema::hasColumn('attachments', 'created_at')) {
                $table->timestamps();
            }
        });
    }

    public function down(): void
    {
        Schema::table('attachments', function (Blueprint $table) {
            if (Schema::hasColumn('attachments', 'bug_id')) {
                $table->dropForeign(['bug_id']);
                $table->dropColumn('bug_id');
            }
            if (Schema::hasColumn('attachments', 'uploaded_by')) {
                $table->dropForeign(['uploaded_by']);
                $table->dropColumn('uploaded_by');
            }
        });
    }
};
