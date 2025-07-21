<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Ambil user ID client
        $clientIds = User::where('role', 'client')->pluck('id');

        // Ambil semua bug yang dibuat oleh client
        $bugsFromClients = Bug::whereIn('reported_by', $clientIds)
            ->with(['project', 'reporter', 'assignee'])
            ->latest()
            ->get();

        return Inertia::render('developer/dashboard', [
            'bugCountFromClients' => $bugsFromClients->count(),
            'bugDetails' => $bugsFromClients->map(function ($bug) {
                return [
                    'id'          => $bug->id,
                    'title'       => $bug->title,
                    'priority'    => $bug->priority,
                    'status'      => $bug->status,
                    'project'     => $bug->project->name ?? '-',
                    'reporter'    => $bug->reporter->name ?? '-',
                    'assignee'    => $bug->assignee->name ?? '-',
                    'created_at'  => $bug->created_at->format('d M Y'),
                ];
            }),
        ]);
    }
}
