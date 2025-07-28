<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('client_id', Auth::id())
            ->withCount('bugs')
            ->latest()
            ->get();

        return Inertia::render('client/project', [
            'projects' => $projects
        ]);
    }
}
