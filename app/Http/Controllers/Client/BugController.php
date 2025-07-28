<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

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
    public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'project_id' => 'required|exists:projects,id',
        'priority' => 'required|in:low,medium,high,critical',
        'description' => 'nullable|string',
        'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png|max:2048'
    ]);

    $validated['reported_by'] = Auth::id();
    $validated['status'] = 'open';

    $bug = Bug::create($validated);

    if ($request->hasFile('attachments')) {
        foreach ($request->file('attachments') as $file) {
            $path = $file->store('bug_attachments', 'public');
            $bug->attachments()->create(['file_path' => $path]);
        }
    }

    return redirect()->route('client.bugs.index')->with('success', 'Bug berhasil dilaporkan.');
}

}
