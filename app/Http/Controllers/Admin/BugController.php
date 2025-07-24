<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;
use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BugController extends Controller
{
    public function index(): Response
    {
       $bugs = Bug::with(['project', 'reporter', 'assignee'])
            ->latest()
            ->get();

        return Inertia::render('admin/bugs', [
            'bugs' => $bugs,
            'projects' => Project::all(),
            'users' => User::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'priority'     => 'required|in:low,medium,high,critical',
            'status'       => 'required|in:open,in_progress,resolved,closed',
            'project_id'   => 'required|exists:projects,id',
            'reported_by'  => 'required|exists:users,id',
            'assigned_to'  => 'nullable|exists:users,id',
            'resolved_at'  => 'nullable|date',
        ]);

        $bug = Bug::create($data);

        if ($bug->assigned_to) {
            Notification::create([
                'user_id' => $bug->assigned_to,
                'title' => 'Penugasan Bug Baru',
                'message' => "Anda telah ditugaskan untuk menangani bug: \"{$bug->title}\". Silakan tinjau dan tangani sesuai prioritas yang ditentukan.",
            ]);
            Notification::create([
                'user_id' => $bug->reported_by,
                'title' => 'Laporan Bug Telah Dikirim',
                'message' => "Laporan bug \"{$bug->title}\" Anda telah berhasil dikirim dan saat ini sedang ditindaklanjuti oleh tim pengembang.",
            ]);
        }
        return redirect()->route('bugs.index')->with('success', 'Bug created successfully.');
    }

    public function update(Request $request, Bug $bug)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'priority'     => 'required|in:low,medium,high,critical',
            'status'       => 'required|in:open,in_progress,resolved,closed',
            'project_id'   => 'required|exists:projects,id',
            'reported_by'  => 'required|exists:users,id',
            'assigned_to'  => 'nullable|exists:users,id',
            'resolved_at'  => 'nullable|date',
        ]);

        $bug->update($data);

        return redirect()->route('bugs.index')->with('success', 'Bug updated successfully.');
    }

    public function destroy(Bug $bug)
    {
        $bug->delete();

        return redirect()->route('bugs.index')->with('success', 'Bug deleted successfully.');
    }
}
