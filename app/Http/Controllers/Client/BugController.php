<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BugController extends Controller
{
    // LIST + FORM BUG
    public function index()
    {
        $user = Auth::user();
        $bugs = Bug::with(['project', 'reporter', 'assignee', 'attachments'])
            ->where('reported_by', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        $major = 1;
        $minor = 0;
        $patch = 0;
        foreach ($bugs as $bug) {
            $bug->version = "{$major}.{$minor}.{$patch}";
            $patch++;
            if ($patch > 9) { $patch = 0; $minor++; }
            if ($minor > 9) { $minor = 0; $major++; }
        }

        $bugs = $bugs->reverse()->values();

        $projects = Project::where('client_id', $user->id)
            ->select('id', 'name')
            ->get();

        $users = User::where('role', 'developer')->select('id', 'name')->get();

        return inertia('client/bug', [
            'bugs' => $bugs,
            'projects' => $projects,
            'users' => $users,
            'auth' => ['user' => $user],
        ]);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'project_id' => 'required|exists:projects,id',
        'description' => 'required|string',
        'assigned_to' => 'nullable|exists:users,id',
        'attachments' => 'nullable|array',
        'attachments.*' => 'file|mimes:jpg,jpeg,png,gif|max:2048'
    ]);

    $validated['reported_by'] = Auth::id();
    $validated['status'] = 'open';
    $validated['priority'] = 'low';
    $validated['assigned_to'] = $request->filled('assigned_to') ? $request->assigned_to : null;

    $bug = Bug::create($validated);

    if ($request->hasFile('attachments')) {
        foreach ($request->file('attachments') as $file) {
            $path = $file->store('bug_attachments', 'public');
            $bug->attachments()->create([
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'uploaded_by' => Auth::id(),
            ]);
        }
    }

    return redirect()->route('client.bugs.index')
        ->with('success', 'Bug berhasil dilaporkan.');
}

}
