<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationSenderService;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;
use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class BugController extends Controller
{
    public function index(Request $request): Response
    {
        $request->validate([
            'status'     => 'nullable|string|in:open,in_progress,resolved,closed',
            'priority'   => 'nullable|string|in:low,medium,high,critical',
            'project_id' => 'nullable|uuid|exists:projects,id',
        ]);

        $bugs = Bug::with(['project', 'reporter', 'assignee', 'attachments'])
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('priority'), function ($query, $priority) {
                $query->where('priority', $priority);
            })
            ->when($request->input('project_id'), function ($query, $projectId) {
                $query->where('project_id', $projectId);
            })
            ->latest()
            ->get();

        return Inertia::render('admin/bugs', [
            'bugs' => $bugs,
            'projects' => Project::all(),
            'users' => User::all(),
            'filters'    => $request->only(['status', 'priority', 'project_id']),
        ]);
    }

    public function store(Request $request, NotificationSenderService $sender)
{
    $data = $request->validate([
        'title'        => 'required|string|max:255',
        'description'  => 'nullable|string',
        'priority'     => 'required|in:low,medium,high,critical',
        'status'       => 'required|in:open,in_progress,resolved,closed',
        'project_id'   => 'required|exists:projects,id',
        'assigned_to'  => 'nullable|exists:users,id',
        'resolved_at'  => 'nullable|date',
        'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,gif,pdf|max:10240',
    ]);

    $data['reported_by'] = Auth::id();

    $bug = Bug::create($data);

    // Simpan semua attachment jika ada
    if ($request->hasFile('attachments')) {
        foreach ($request->file('attachments') as $file) {
            $path = $file->store('attachments', 'public');

            $bug->attachments()->create([
                'file_path'   => $path,
                'file_name'   => $file->getClientOriginalName(),
                'uploaded_by' => Auth::id(),
            ]);
        }
    }

    $bug->load('assignee');

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

    return redirect()->route('bugs.index')->with('success', 'Bug created successfully.');
}
public function updateStatus(NotificationSenderService $sender)
{
    $user = User::find(1);

    $sender->sendToUser($user, 'Status Pesanan Diperbarui', 'Pesanan Anda telah diproses oleh admin.');

    return redirect()->back()->with('success', 'Notifikasi dikirim.');
}

    public function update(Request $request, Bug $bug)
{
    $data = $request->validate([
        'title'        => 'required|string|max:255',
        'description'  => 'nullable|string',
        'priority'     => 'required|in:low,medium,high,critical',
        'status'       => 'required|in:open,in_progress,resolved,closed',
        'project_id'   => 'required|exists:projects,id',
        'assigned_to'  => 'nullable|exists:users,id',
        'resolved_at'  => 'nullable|date',
        'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,gif,pdf|max:10240',
    ]);

    $bug->update($data);

    if ($request->hasFile('attachments')) {
        foreach ($bug->attachments as $attachment) {
            if (Storage::disk('public')->exists($attachment->file_path)) {
                Storage::disk('public')->delete($attachment->file_path);
            }
            $attachment->delete();
        }

        foreach ($request->file('attachments') as $file) {
            $path = $file->store('attachments', 'public');

            $bug->attachments()->create([
                'file_path'   => $path,
                'file_name'   => $file->getClientOriginalName(),
                'uploaded_by' => Auth::id(),
            ]);
        }
    }

    return redirect()->route('bugs.index')->with('success', 'Bug updated successfully.');
}
}
