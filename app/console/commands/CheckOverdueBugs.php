<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Bug;
use App\Services\NotificationSenderService;
use Carbon\Carbon;

class CheckOverdueBugs extends Command
{
    protected $signature = 'bugs:check-overdue';
    protected $description = 'Kirim warning ke developer dan permintaan maaf ke client untuk bug yang melewati deadline';

    public function handle(NotificationSenderService $sender): int
    {
        $now = Carbon::now();
        $admins = User::where('role', 'admin')->get();
        $bugs = Bug::with(['assignee','reporter','project'])
            ->whereNotIn('status', ['resolved','closed'])
            ->whereNotNull('due_at')
            ->where('due_at', '<', $now)
            ->get();

        foreach ($bugs as $bug) {
            if ($bug->overdue_notified_at && $bug->overdue_notified_at->diffInHours($now) < 24) {
                continue;
            }

            $deadline = $bug->due_at->timezone(config('app.timezone'))->format('d M Y H:i');

            if ($bug->assignee) {
                $sender->sendToUser(
                    $bug->assignee,
                    'Deadline Bug Terlewat',
                    "Bug \"{$bug->title}\" (Project: {$bug->project?->name}) melewati deadline {$deadline}."
                );
            }

            if ($bug->reporter) {
                $sender->sendToUser(
                    $bug->reporter,
                    'Mohon Maaf, Ada Keterlambatan',
                    "Bug \"{$bug->title}\" melewati estimasi selesai {$deadline}. Tim kami sedang menanganinya."
                );
            }

            $bug->update(['overdue_notified_at' => $now]);
        }

        // Pending approval reminders and auto-cancel after 72h
        $pending = Bug::with(['reporter','project'])
            ->where('is_approved', false)
            ->where('status', 'pending')
            ->get();

        foreach ($pending as $bug) {
            $created = $bug->created_at ?? $now;
            $ageHours = $created->diffInHours($now);

            // Reminder at >=48h (24h before cancel)
            if ($ageHours >= 48 && !$bug->approval_reminder_sent_at) {
                foreach ($admins as $admin) {
                    $sender->sendToUser(
                        $admin,
                        'Reminder: Approval Bug Tertunda',
                        "Bug {$bug->ticket_number} menunggu persetujuan. Akan dibatalkan otomatis dalam 24 jam jika tidak disetujui."
                    );
                }

                $bug->forceFill(['approval_reminder_sent_at' => $now])->save();
            }

            // Auto-cancel at >=72h
            if ($ageHours >= 72 && !$bug->approval_canceled_at) {
                $bug->forceFill([
                    'status' => 'closed',
                    'is_approved' => false,
                    'approved_at' => null,
                    'approved_by' => null,
                    'approval_canceled_at' => $now,
                ])->save();

                if ($bug->reporter) {
                    $sender->sendToUser(
                        $bug->reporter,
                        'Permintaan Maaf: Bug Dibatalkan',
                        "Laporan bug {$bug->ticket_number} belum disetujui admin dalam 72 jam sehingga dibatalkan. Mohon maaf atas ketidaknyamanan ini. Silakan kirim ulang jika masih diperlukan."
                    );
                }
            }
        }

        $this->info('Overdue check completed');
        return Command::SUCCESS;
    }
}
