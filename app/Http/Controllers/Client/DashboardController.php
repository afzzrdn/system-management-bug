<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $projectIds = Project::where('client_id', $user->id)->pluck('id');

        $stats = [
            'bugReported' => Bug::whereIn('project_id', $projectIds)->count(),
            'bugFixed' => Bug::whereIn('project_id', $projectIds)->where('status', 'resolved')->count(),
            'activeProjects' => $projectIds->count(),
        ];

        $recentBugs = Bug::with('project:id,name')
            ->whereIn('project_id', $projectIds)
            ->latest()
            ->get()
            ->map(fn ($bug) => [
                'id' => $bug->id,
                'title' => $bug->title,
                'project' => $bug->project->name,
                'status' => $bug->status,
                'full_bug' => $bug->load('reporter', 'assignee', 'attachments'),
            ]);

        $devLogs = Bug::whereIn('project_id', $projectIds)
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(fn ($bug) => [
                'id' => $bug->id,
                'title' => "Bug '{$bug->title}' diperbarui",
                'description' => 'Status diubah menjadi ' . ucwords(str_replace('_', ' ', $bug->status)) . ' pada ' . $bug->updated_at->format('d M Y'),
                'icon' => '🔄',
            ]);

        return Inertia::render('client/dashboard', [
            'stats' => $stats,
            'recentBugs' => $recentBugs,
            'devLogs' => $devLogs,
        ]);
    }
}
