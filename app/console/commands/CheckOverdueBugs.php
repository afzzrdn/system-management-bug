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

        $this->info('Overdue check completed');
        return Command::SUCCESS;
    }
}
