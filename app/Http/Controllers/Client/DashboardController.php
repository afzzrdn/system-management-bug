<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // Statistik
        $bugReported = Bug::where('reported_by', $userId)->count();
        $bugFixed = Bug::where('reported_by', $userId)->where('status', 'resolved')->count();
        $activeProjects = Project::where('client_id', $userId)->count();

        // Bug terbaru (limit 5)
        $recentBugs = Bug::where('reported_by', $userId)
            ->with('project:id,name')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($bug) {
                return [
                    'id' => $bug->id,
                    'title' => $bug->title,
                    'project' => $bug->project->name ?? 'N/A',
                    'status' => $bug->status,
                ];
            });

        // Development log (sementara dummy, bisa diambil dari tabel log kalau ada)
        $devLogs = [
            ['id' => 1, 'title' => 'Bug Fix v1.0.1', 'description' => 'Perbaikan bug form laporan', 'icon' => '🔧'],
            ['id' => 2, 'title' => 'UI Update', 'description' => 'Perbaikan tampilan dashboard', 'icon' => '🎨'],
        ];

        return Inertia::render('client/dashboard', [
            'auth' => ['user' => Auth::user()],
            'stats' => [
                'bugReported' => $bugReported,
                'bugFixed' => $bugFixed,
                'activeProjects' => $activeProjects,
            ],
            'recentBugs' => $recentBugs,
            'devLogs' => $devLogs,
        ]);
    }
}
