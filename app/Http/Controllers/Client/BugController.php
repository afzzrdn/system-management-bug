<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BugController extends Controller
{
    public function index()
    {
        $bugs = Bug::with(['project', 'reporter', 'assignee'])
            ->where('reported_by', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('client/bug', [
            'bugs' => $bugs,
            'projects' => Project::all(),
            'users' => User::all(),
        ]);
    }

    // Tambahkan store, update, destroy jika perlu
}
