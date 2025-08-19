<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationSenderService;
use Illuminate\Support\Facades\Auth;
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
            'type'       => 'nullable|string|in:Tampilan,Performa,Fitur,Keamanan,Error,Lainnya',
        ]);

        $bugs = Bug::with(['project', 'reporter', 'assignee', 'attachments'])
            ->when($request->input('status'), fn($q, $v) => $q->where('status', $v))
            ->when($request->input('priority'), fn($q, $v) => $q->where('priority', $v))
            ->when($request->input('project_id'), fn($q, $v) => $q->where('project_id', $v))
            ->when($request->input('type'), fn($q, $v) => $q->where('type', $v))
            ->latest()
            ->get();

        $bugs = $bugs->map(function ($bug) {
            $bugArray = $bug->toArray();
            $bugArray['attachments'] = $bug->attachments->map(function ($att) {
                return asset('storage/' . $att->file_path);
            })->values();
            return $bugArray;
        });

        return Inertia::render('admin/bugs', [
            'bugs'     => $bugs,
            'projects' => Project::all(),
            'users'    => User::all(),
            'filters'  => $request->only(['status', 'priority', 'project_id', 'type']),
        ]);
    }

    public function store(Request $request, NotificationSenderService $sender)
    {
        $data = $request->validate([
            'title'             => 'required|string|max:255',
            'description'       => 'nullable|string',
            'priority'          => 'required|in:low,medium,high,critical',
            'status'            => 'required|in:open,in_progress,resolved,closed',
            'type'              => 'required|in:Tampilan,Performa,Fitur,Keamanan,Error,Lainnya',
            'project_id'        => 'required|exists:projects,id',
            'assigned_to'       => 'nullable|exists:users,id',
            'resolved_at'       => 'nullable|date',
            'schedule_start_at' => 'nullable|date',
            'due_at'            => 'nullable|date|after_or_equal:schedule_start_at',
            'attachments.*'     => 'nullable|file|mimes:jpg,jpeg,png,gif,pdf,webp|max:10240',
        ]);

        $data['reported_by'] = Auth::id();
        $bug = Bug::create($data);

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

        $bug->load(['assignee', 'reporter', 'project']);

        if ($bug->assigned_to && $bug->due_at) {
            $deadline = $bug->due_at->timezone(config('app.timezone'))->format('d M Y H:i');
            $sender->sendToUser(
                $bug->assignee,
                'Penugasan Bug + Jadwal',
                "Anda ditugaskan menangani bug: \"{$bug->title}\" (Project: {$bug->project?->name}). Deadline: {$deadline}."
            );
        }

        if ($bug->reporter && $bug->due_at) {
            $eta = $bug->due_at->timezone(config('app.timezone'))->format('d M Y H:i');
            $sender->sendToUser(
                $bug->reporter,
                'Estimasi Penyelesaian Bug',
                "Bug \"{$bug->title}\" diperkirakan selesai pada {$eta}."
            );
        }

        return redirect()->route('bugs.index')->with('success', 'Bug created successfully.');
    }

    public function update(Request $request, Bug $bug, NotificationSenderService $sender)
    {
        $data = $request->validate([
            'title'             => 'required|string|max:255',
            'description'       => 'nullable|string',
            'priority'          => 'required|in:low,medium,high,critical',
            'status'            => 'required|in:open,in_progress,resolved,closed',
            'type'              => 'required|in:Tampilan,Performa,Fitur,Keamanan,Error,Lainnya',
            'project_id'        => 'required|exists:projects,id',
            'assigned_to'       => 'nullable|exists:users,id',
            'resolved_at'       => 'nullable|date',
            'schedule_start_at' => 'nullable|date',
            'due_at'            => 'nullable|date|after_or_equal:schedule_start_at',
            'delay_reason'      => 'nullable|string|max:2000',
            'attachments.*'     => 'nullable|file|mimes:jpg,jpeg,png,gif,pdf,webp|max:10240',
        ]);

        $oldDue = $bug->due_at;
        $oldAssignee = $bug->assigned_to;

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

        $bug->load(['assignee','reporter','project']);

        if ($bug->due_at && ($oldDue?->ne($bug->due_at) || $oldAssignee !== $bug->assigned_to)) {
            $deadline = $bug->due_at->timezone(config('app.timezone'))->format('d M Y H:i');

            if ($bug->assignee) {
                $sender->sendToUser(
                    $bug->assignee,
                    'Update Jadwal Bug',
                    "Deadline bug \"{$bug->title}\" (Project: {$bug->project?->name}) diperbarui: {$deadline}."
                );
            }
            if ($bug->reporter) {
                $sender->sendToUser(
                    $bug->reporter,
                    'Update Estimasi Penyelesaian',
                    "Estimasi selesai untuk bug \"{$bug->title}\" diperbarui menjadi {$deadline}."
                );
            }
        }

        return redirect()->route('bugs.index')->with('success', 'Bug updated successfully.');
    }
}
