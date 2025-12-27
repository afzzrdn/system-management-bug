<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Services\NotificationSenderService;
use App\Models\Bug;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BugController extends Controller
{
    public function index()
    {
        $developerId = Auth::id();
        $bugs = Bug::with(['project', 'reporter', 'attachments'])
            ->where('assigned_to', $developerId)
            ->where('is_approved', true)
            ->latest()
            ->get();
        $stats = [
            'assigned' => Bug::where('assigned_to', $developerId)->where('is_approved', true)->where('status', 'open')->count(),
            'in_progress' => Bug::where('assigned_to', $developerId)->where('is_approved', true)->where('status', 'in_progress')->count(),
            'resolved' => Bug::where('assigned_to', $developerId)->where('is_approved', true)->where('status', 'resolved')->count(),
        ];
        return inertia('developer/bugs', [
            'bugs' => $bugs,
            'stats' => $stats,
            'auth' => ['user' => Auth::user()],
        ]);
    }

    public function update(Request $request, Bug $bug, NotificationSenderService $sender)
    {
        if ($bug->assigned_to !== Auth::id()) {
            abort(403, 'Akses ditolak');
        }

        $request->validate(['status' => 'required|in:open,in_progress,resolved,closed']);

        $prevStatus = $bug->status;
        $newStatus = $request->status;

        $bug->status = $newStatus;

        if ($newStatus === 'in_progress' && $prevStatus !== 'in_progress' && !$bug->schedule_start_at) {
            $bug->schedule_start_at = Carbon::now();
        }

        if ($newStatus === 'resolved' && !$bug->resolved_at) {
            $bug->resolved_at = Carbon::now();
        }

        $bug->save();
        $bug->load('reporter','project');

        if ($bug->reporter) {
            if ($bug->status === 'resolved') {
                if ($bug->due_at && $bug->resolved_at && $bug->resolved_at->lte($bug->due_at)) {
                    $sender->sendToUser($bug->reporter, 'Bug Selesai Sesuai Jadwal', "Bug \"{$bug->title}\" pada project {$bug->project?->name} telah diselesaikan tepat waktu.");
                } else {
                    $sender->sendToUser($bug->reporter, 'Bug Telah Selesai', "Bug \"{$bug->title}\" pada project {$bug->project?->name} telah diselesaikan.");
                }
            } else {
                $statusText = match ($bug->status) {
                    'open' => 'dibuka',
                    'in_progress' => 'sedang ditangani',
                    'closed' => 'ditutup',
                    default => $bug->status,
                };
                if ($bug->status !== 'resolved') {
                    $sender->sendToUser($bug->reporter, 'Status Bug Diperbarui', "Status bug \"{$bug->title}\" diperbarui menjadi {$statusText}.");
                }
            }
        }
        return redirect()->back()->with('success', 'Status bug berhasil diperbarui.');
    }

    public function show(Bug $bug)
    {
        if ($bug->assigned_to !== Auth::id()) {
            abort(403, 'AKSES DITOLAK');
        }
        $bug->load(['project', 'reporter', 'attachments']);
        if (request()->wantsJson()) {
            return response()->json(['bug' => $bug]);
        }
        return inertia('components/BugDetail', ['bug' => $bug]);
    }
    public function board()
{
    $devId = Auth::id();
    $bugs = \App\Models\Bug::with(['project:id,name'])
        ->where('assigned_to', $devId)
        ->where('is_approved', true)
        ->orderBy('priority','desc')
        ->get(['id','title','status','priority','project_id']);

    return \Inertia\Inertia::render('developer/board', [
        'bugs' => $bugs,
    ]);
}

public function move(\App\Models\Bug $bug)
{
    abort_unless($bug->assigned_to === Auth::id(), 403);
    request()->validate([
        'status' => ['required','in:open,in_progress,resolved']
    ]);
    $bug->status = request('status');
    // opsional: saat geser ke in_progress, isi assigned_to kalau kosong
    if (!$bug->assigned_to) $bug->assigned_to = Auth::id();
    if ($bug->status === 'resolved' && !$bug->resolved_at) $bug->resolved_at = now();
    $bug->save();
    return response()->json(['ok'=>true]);
}

}
