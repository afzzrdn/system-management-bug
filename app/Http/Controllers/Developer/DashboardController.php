<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $userId = Auth::id();

        $clientIds = User::where('role', 'client')->pluck('id');
        $bugsFromClients = Bug::whereIn('reported_by', $clientIds)
            ->with(['project', 'reporter', 'assignee'])
            ->latest()
            ->get();

        $bugStatusStats = [
            'open'        => $bugsFromClients->where('status', 'open')->count(),
            'in_progress' => $bugsFromClients->where('status', 'in_progress')->count(),
            'resolved'    => $bugsFromClients->where('status', 'resolved')->count(),
        ];

        $weeks = [];
        for ($i = 7; $i >= 0; $i--) {
            $start = Carbon::now()->startOfWeek()->subWeeks($i);
            $end   = $start->copy()->endOfWeek();
            $weeks[] = [
                'start' => $start->toDateString(),
                'end'   => $end->toDateString(),
                'label' => $start->format('d M'),
            ];
        }

        $resolvedCounts = [];
        foreach ($weeks as $w) {
            $count = Bug::where('assigned_to', $userId)
                ->where('status', 'resolved')
                ->whereDate('resolved_at', '>=', $w['start'])
                ->whereDate('resolved_at', '<=', $w['end'])
                ->count();

            $resolvedCounts[] = $count;
        }
        $driver = DB::getDriverName();
        $secondsDiffExpr = $driver === 'pgsql'
            ? "EXTRACT(EPOCH FROM (resolved_at - created_at))"
            : "TIMESTAMPDIFF(SECOND, created_at, resolved_at)";

        $avgSeconds = Bug::where('assigned_to', $userId)
            ->whereNotNull('resolved_at')
            ->selectRaw("AVG($secondsDiffExpr) AS s")
            ->value('s');

        $avgLeadHours = $avgSeconds ? round(((float)$avgSeconds) / 3600, 1) : 0;

        return Inertia::render('developer/dashboard', [
            'bugCountFromClients' => $bugsFromClients->count(),
            'bugDetails' => $bugsFromClients->map(function ($bug) {
                return [
                    'id'         => $bug->id,
                    'title'      => $bug->title,
                    'priority'   => $bug->priority,
                    'status'     => $bug->status,
                    'project'    => $bug->project->name ?? '-',
                    'reporter'   => $bug->reporter->name ?? '-',
                    'assignee'   => $bug->assignee->name ?? '-',
                    'created_at' => $bug->created_at->format('d M Y'),
                ];
            }),
            'bugStatusStats' => $bugStatusStats,

            'weeklyResolved' => [
                'labels' => array_column($weeks, 'label'),
                'counts' => $resolvedCounts,
            ],
            'avgLeadHours' => $avgLeadHours,
        ]);
    }
}
