<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use Illuminate\Support\Facades\Auth;

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
    public function show(Bug $bug)
{
    if ($bug->assigned_to !== Auth::id()) {
        abort(403, 'AKSES DITOLAK');
    }

    $bug->load(['project', 'reporter', 'attachments']);

    // Kalau request dari axios (AJAX/JSON), kirim JSON
    if (request()->wantsJson()) {
        return response()->json([
            'bug' => $bug
        ]);
    }

    // Kalau request biasa (navigasi Inertia), kirim Inertia view
    return inertia('developer/BugDetail', [
        'bug' => $bug,
    ]);
}

}
