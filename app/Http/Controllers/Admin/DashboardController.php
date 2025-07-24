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

        return Inertia::render('admin/dashboard', [
            'userCount' => $userCount,
            'bugCount' => $bugCount,
            'projectCount' => $projectCount
        ]);
    }
}