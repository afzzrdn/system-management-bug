<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $data = Cache::remember('client_dashboard_' . $user->id, 300, function () use ($user) {
            $projectIds = Project::where('client_id', $user->id)->pluck('id');

            $stats = [
                'bugReported' => Bug::whereIn('project_id', $projectIds)->count(),
                'bugFixed' => Bug::whereIn('project_id', $projectIds)->where('status', 'resolved')->count(),
                'activeProjects' => $projectIds->count(),
            ];

            $bugStatusStats = [
                'open' => Bug::whereIn('project_id', $projectIds)->where('status', 'open')->count(),
                'in_progress' => Bug::whereIn('project_id', $projectIds)->where('status', 'in_progress')->count(),
                'resolved' => Bug::whereIn('project_id', $projectIds)->where('status', 'resolved')->count(),
                'closed' => Bug::whereIn('project_id', $projectIds)->where('status', 'closed')->count(),
            ];

            // Trends: Bugs created in the last 7 days for client's projects
            $trends = Bug::whereIn('project_id', $projectIds)
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
                ->where('created_at', '>=', Carbon::now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            $bugTrends = [
                'labels' => [],
                'data' => []
            ];

            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->format('Y-m-d');
                $bugTrends['labels'][] = Carbon::now()->subDays($i)->format('d M');
                $record = $trends->firstWhere('date', $date);
                $bugTrends['data'][] = $record ? $record->count : 0;
            }

            $recentBugs = Bug::with('project:id,name')
                ->whereIn('project_id', $projectIds)
                ->latest()
                ->get()
                ->map(fn($bug) => [
                    'id' => $bug->id,
                    'title' => $bug->title,
                    'project' => $bug->project->name,
                    'status' => $bug->status,
                    'full_bug' => $bug->load('reporter', 'assignee', 'attachments'),
                ]);

            $devLogs = Bug::whereIn('project_id', $projectIds)
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(fn($bug) => [
                    'id' => $bug->id,
                    'title' => "Bug '{$bug->title}' diperbarui",
                    'description' => 'Status diubah menjadi ' . ucwords(str_replace('_', ' ', $bug->status)) . ' pada ' . $bug->updated_at->format('d M Y'),
                    'icon' => '🔄',
                ]);

            return compact('stats', 'recentBugs', 'devLogs', 'bugStatusStats', 'bugTrends');
        });

        return Inertia::render('client/dashboard', $data);
    }
}
