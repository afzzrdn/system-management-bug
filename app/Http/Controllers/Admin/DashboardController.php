<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Bug;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = Cache::remember('admin_dashboard_stats', 600, function () {
            $userCount = User::count();
            $bugCount = Bug::count();
            $projectCount = Project::count();

            $bugStatusStats = [
                'open' => Bug::where('status', 'open')->count(),
                'in_progress' => Bug::where('status', 'in_progress')->count(),
                'resolved' => Bug::where('status', 'resolved')->count(),
            ];

            $bugPriorityStats = [
                'low' => Bug::where('priority', 'low')->count(),
                'medium' => Bug::where('priority', 'medium')->count(),
                'high' => Bug::where('priority', 'high')->count(),
                'critical' => Bug::where('priority', 'critical')->count(),
            ];

            // Trends: Bugs created in the last 7 days
            $trends = Bug::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
                ->where('created_at', '>=', Carbon::now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            $bugTrends = [
                'labels' => [],
                'data' => []
            ];

            // Fill in missing dates
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->format('Y-m-d');
                $bugTrends['labels'][] = Carbon::now()->subDays($i)->format('d M');
                $record = $trends->firstWhere('date', $date);
                $bugTrends['data'][] = $record ? $record->count : 0;
            }

            return compact('userCount', 'bugCount', 'projectCount', 'bugStatusStats', 'bugPriorityStats', 'bugTrends');
        });

        return Inertia::render('admin/dashboard', $stats);
    }
}
