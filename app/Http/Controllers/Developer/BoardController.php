<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use App\Services\NotificationSenderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BoardController extends Controller
{

    public function index()
    {
        $devId = Auth::id();

        $bugs = \App\Models\Bug::with(['project:id,name'])
        ->where('assigned_to', $devId)
        ->orderByRaw("
            CASE priority
                WHEN 'critical' THEN 1
                WHEN 'high'    THEN 2
                WHEN 'medium'  THEN 3
                WHEN 'low'     THEN 4
                ELSE 5
            END
        ")
        ->orderByDesc('created_at')
        ->get(['id','title','status','priority','project_id']);

        return Inertia::render('developer/board', [
            'bugs' => $bugs,
        ]);
    }

    public function move(Bug $bug, Request $request, NotificationSenderService $sender)
    {

        abort_unless($bug->assigned_to === Auth::id(), 403);

        $data = $request->validate([
            'status' => ['required', 'in:open,in_progress,resolved'],
        ]);

        $prevStatus = $bug->status;
        $newStatus  = $data['status'];

        $bug->status = $newStatus;

        if ($newStatus === 'in_progress' && $prevStatus !== 'in_progress' && is_null($bug->schedule_start_at)) {
            $bug->schedule_start_at = now();
        }

        if ($newStatus === 'resolved' && is_null($bug->resolved_at)) {
            $bug->resolved_at = now();
        }

        if (is_null($bug->assigned_to)) {
            $bug->assigned_to = Auth::id();
        }

        $bug->save();

        $this->handleStatusChange($bug, $prevStatus, $sender);

        return response()->json(['ok' => true]);
    }

    private function handleStatusChange(Bug $bug, string $prevStatus, NotificationSenderService $sender): void
    {

        $bug->loadMissing('reporter', 'project');

        if (!$bug->reporter) {
            return;
        }

        if ($bug->status === 'resolved') {

            if ($bug->due_at && $bug->resolved_at && $bug->resolved_at->lte($bug->due_at)) {
                $sender->sendToUser(
                    $bug->reporter,
                    'Bug Selesai Sesuai Jadwal',
                    "Bug \"{$bug->title}\" pada project {$bug->project?->name} telah diselesaikan tepat waktu."
                );
            } else {
                $sender->sendToUser(
                    $bug->reporter,
                    'Bug Telah Selesai',
                    "Bug \"{$bug->title}\" pada project {$bug->project?->name} telah diselesaikan."
                );
            }
            return;
        }

        // Untuk status selain resolved
        $statusText = match ($bug->status) {
            'open'        => 'dibuka',
            'in_progress' => 'sedang ditangani',
            default       => $bug->status,
        };

        $sender->sendToUser(
            $bug->reporter,
            'Status Bug Diperbarui',
            "Status bug \"{$bug->title}\" diperbarui menjadi {$statusText}."
        );
    }
}
