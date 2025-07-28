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
use Illuminate\Support\Facades\Storage;

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
            'attachment'   => 'nullable|file|mimes:jpg,jpeg,png,pdf,docx|max:5120',
        ]);

        $bug = Bug::create($data);

        // Simpan attachment sebagai relasi jika ada file
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('attachments', 'public');

            $bug->attachments()->create([
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'uploaded_by' => Auth::id(),
            ]);
        }

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
            'attachment'   => 'nullable|file|mimes:jpg,jpeg,png,pdf,docx|max:5120',
        ]);

        $bug->update($data);

        if ($request->hasFile('attachment')) {
        foreach ($bug->attachments as $attachment) {
            if (Storage::disk('public')->exists($attachment->file_path)) {
                Storage::disk('public')->delete($attachment->file_path);
            }
            $attachment->delete();
        }

        $file = $request->file('attachment');
        $path = $file->store('attachments', 'public');

        $bug->attachments()->create([
            'file_path'   => $path,
            'file_name'   => $file->getClientOriginalName(),
            'uploaded_by' => Auth::id(),
        ]);
    }

    return redirect()->route('bugs.index')->with('success', 'Bug updated successfully.');
}


    public function destroy(Bug $bug)
    {
        foreach ($bug->attachments as $attachment) {
        if (Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }
    }
        $bug->delete();

        return redirect()->route('bugs.index')->with('success', 'Bug deleted successfully.');
    }
}
