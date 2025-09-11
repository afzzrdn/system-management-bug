<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Services\NotificationSenderService;
use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Enums\BugType;

class BugController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $page = $request->get('page', 1);
        $perPage = 10;
        $loadRandom = $request->boolean('load_random', false);

        if ($loadRandom) {
            // Load random bugs for infinite scroll
            $bugs = Bug::with(['project', 'reporter', 'assignee', 'attachments'])
                ->where('reported_by', $user->id)
                ->inRandomOrder()
                ->limit($perPage)
                ->get();
        } else {
            // Load initial bugs with pagination
            $bugs = Bug::with(['project', 'reporter', 'assignee', 'attachments'])
                ->where('reported_by', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);
        }

        // Add version numbers to bugs
        $major = 1; $minor = 0; $patch = 0;
        foreach ($bugs as $bug) {
            $bug->version = "{$major}.{$minor}.{$patch}";
            $patch++;
            if ($patch > 9) { $patch = 0; $minor++; }
            if ($minor > 9) { $minor = 0; $major++; }
        }

        $projects = Project::where('client_id', $user->id)->select('id','name')->get();
        $users    = User::where('role', 'developer')->select('id','name')->get();

        // Return JSON for AJAX requests (infinite scroll)
        if ($request->expectsJson()) {
            return response()->json([
                'bugs' => $loadRandom ? $bugs : $bugs->items(),
                'has_more' => $loadRandom ? true : $bugs->hasMorePages(),
                'next_page' => $loadRandom ? null : ($bugs->hasMorePages() ? $bugs->currentPage() + 1 : null),
            ]);
        }

        // Return Inertia response for initial page load
        return inertia('client/bug', [
            'bugs'     => $loadRandom ? $bugs : $bugs->items(),
            'projects' => $projects,
            'users'    => $users,
            'auth'     => ['user' => $user],
            'pagination' => $loadRandom ? null : [
                'current_page' => $bugs->currentPage(),
                'has_more' => $bugs->hasMorePages(),
                'next_page' => $bugs->hasMorePages() ? $bugs->currentPage() + 1 : null,
            ],
        ]);
    }

    public function store(Request $request, NotificationSenderService $sender)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'project_id'   => 'required|exists:projects,id',
            'description'  => 'required|string',
            'assigned_to'  => 'nullable|exists:users,id',
            'attachments'  => 'nullable|array',
            'attachments.*'=> 'file|mimes:jpg,jpeg,png,gif,pdf|max:2048',
        ]);

        $validated['reported_by'] = Auth::id();
        $validated['status']      = 'open';
        $validated['priority']    = 'low';
        $validated['assigned_to'] = $request->filled('assigned_to') ? $request->assigned_to : null;
        $validated['type']        = BugType::Lainnya->value;

        $bug = Bug::create($validated);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('bug_attachments', 'public');
                $bug->attachments()->create([
                    'file_path'   => $path,
                    'file_name'   => $file->getClientOriginalName(),
                    'uploaded_by' => Auth::id(),
                ]);
            }
        }

        if ($bug->assigned_to) {
            $sender->sendToUser(
                $bug->assignee,
                'Penugasan Bug Baru',
                "Anda telah ditugaskan untuk menangani bug: \"{$bug->title}\". Silakan tinjau dan tangani sesuai prioritas yang ditentukan."
            );
        }

        $sender->sendToUser(
            $bug->reporter,
            'Laporan Bug Telah Dikirim',
            "Laporan bug \"{$bug->title}\" Anda telah berhasil dikirim dan saat ini sedang ditindaklanjuti oleh tim pengembang."
        );

        $adminUsers = User::where('role', 'admin')->get();
        foreach ($adminUsers as $admin) {
            $sender->sendToUser(
                $admin,
                'Bug Baru dari Client',
                "Client {$bug->reporter->name} melaporkan bug: \"{$bug->title}\". Silakan distribusikan ke developer."
            );
        }

        return redirect()->route('client.bugs.index')
            ->with('success', 'Bug berhasil dilaporkan.');
    }
}
