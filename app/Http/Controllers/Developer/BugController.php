<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Services\NotificationSenderService;
use App\Models\Bug;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class BugController extends Controller
{
    public function index()
    {
        $developerId = Auth::id();

        // 1. Ambil semua bug yang ditugaskan ke developer ini
        $bugs = Bug::with(['project', 'reporter', 'attachments'])
            ->where('assigned_to', $developerId)
            ->latest()
            ->get();

        // 2. Hitung statistik untuk kartu di bagian atas
        $stats = [
            'assigned' => Bug::where('assigned_to', $developerId)->where('status', 'open')->count(),
            'in_progress' => Bug::where('assigned_to', $developerId)->where('status', 'in_progress')->count(),
            'resolved' => Bug::where('assigned_to', $developerId)->where('status', 'resolved')->count(),
        ];

        // 3. Kirim data ke view Inertia
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

        $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
        ]);

        $bug->update([
            'status' => $request->status,
        ]);

        $bug->load('reporter');

        if ($bug->reporter) {
            $statusText = match ($bug->status) {
                'open' => 'dibuka',
                'in_progress' => 'sedang ditangani',
                'resolved' => 'telah diselesaikan',
                'closed' => 'ditutup',
                default => $bug->status,
            };

            $sender->sendToUser(
                $bug->reporter,
                'Status Bug Diperbarui',
                "Status bug \"{$bug->title}\" telah diperbarui menjadi *{$statusText}* oleh developer."
            );
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
            return response()->json([
                'bug' => $bug
            ]);
        }

        return inertia('components/BugDetail', [
            'bug' => $bug,
        ]);
    }

}
