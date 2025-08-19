<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Bug;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
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

        return Inertia::render('admin/dashboard', [
            'userCount' => $userCount,
            'bugCount' => $bugCount,
            'projectCount' => $projectCount,
            'bugStatusStats' => $bugStatusStats,
            'bugPriorityStats' => $bugPriorityStats,
        ]);
    }
}
