<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
        return Inertia::render('admin/bugs', [
            'bugs' => Bug::with(['project', 'reporter', 'assignee'])->latest()->get(),
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

        Bug::create($data);

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
