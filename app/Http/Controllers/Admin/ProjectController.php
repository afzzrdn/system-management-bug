<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationSenderService;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use App\Enums\UserRole;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    // ========= Helper pesan =========
    private function formatProjectMessage(Project $project, string $context): array
    {
        // Potong deskripsi agar tidak kepanjangan di WA
        $desc = $project->description ? strip_tags($project->description) : '';
        if (mb_strlen($desc) > 120) {
            $desc = mb_substr($desc, 0, 120) . '…';
        }

        // Judul + pesan disesuaikan konteks
        switch ($context) {
            case 'created':
                $title   = 'Project Baru Dibuat';
                $message = "Project: *{$project->name}*\n"
                         . "Status: aktif\n"
                         . "Akses: Menu *Project Saya* lalu pilih project Anda.";
                break;

            case 'updated':
                $title   = 'Project Diperbarui';
                $message = "Project: *{$project->name}*\n"
                         . "Perubahan data project telah disimpan.\n"
                         . "Akses: Menu *Project Saya* untuk detail terbaru.";
                break;

            case 'moved_from':
                $title   = 'Project Dipindahkan';
                $message = "Project: *{$project->name}*\n"
                         . "Project ini tidak lagi berada di bawah akun Anda.";
                break;

            case 'moved_to':
                $title   = 'Project Dialihkan ke Akun Anda';
                $message = "Project: *{$project->name}*\n"
                         . "Project ini sekarang berada di bawah akun Anda.\n"
                         . "Akses: Menu *Project Saya* untuk melihat detail.";
                break;

            case 'deleted':
                $title   = 'Project Dihapus';
                $message = "Project: *{$project->name}*\n"
                         . "Project telah dihapus oleh admin.";
                break;

            default:
                $title = 'Notifikasi Project';
                $message = "Project: *{$project->name}*";
        }

        return [$title, $message];
    }

    // ========= CRUD =========

    public function index(): Response
    {
        $projects = Project::with('client')->withCount('bugs')->latest()->get();
        $clients  = User::where('role', UserRole::Client->value)->get();

        return Inertia::render('admin/project', [
            'projects' => $projects,
            'clients'  => $clients,
        ]);
    }

    // create + kirim notif ke client
    public function store(Request $request, NotificationSenderService $sender)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_id'   => 'required|exists:users,id,role,' . UserRole::Client->value,
        ]);

        $project = Project::create($validated);

        if ($client = User::find($validated['client_id'])) {
            [$title, $message] = $this->formatProjectMessage($project, 'created');
            $sender->sendToUser($client, $title, $message);
        }

        return redirect()->route('projects.index')->with('success', 'Project berhasil dibuat.');
    }

    // detail JSON (dipakai modal detail via axios)
    public function show(Project $project)
    {
        $project->load([
            'client:id,name',
            'bugs' => function ($query) {
                $query->with('attachments:id,bug_id,file_path')
                      ->orderBy('created_at', 'desc');
            }
        ]);

        // versi bug
        $major = 1; $minor = 0; $patch = 0;
        foreach ($project->bugs as $bug) {
            $bug->version = "{$major}.{$minor}.{$patch}";
            $patch++;
            if ($patch > 9) { $patch = 0; $minor++; }
            if ($minor > 9) { $minor = 0; $major++; }
        }

        // url attachment
        $project->bugs->each(function ($bug) {
            $bug->attachments->transform(function ($attachment) {
                $attachment->file_url = url('storage/' . $attachment->file_path);
                return $attachment;
            });
        });

        return response()->json([
            'project' => $project
        ]);
    }

    // update + notif: perubahan data / perpindahan client
    public function update(Request $request, Project $project, NotificationSenderService $sender)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_id'   => 'required|exists:users,id,role,' . UserRole::Client->value,
        ]);

        $clientChanged = $project->client_id !== $validated['client_id'];
        $oldClient     = $clientChanged ? User::find($project->client_id) : null;

        $project->update($validated);

        if ($clientChanged) {
            if ($oldClient) {
                [$title, $message] = $this->formatProjectMessage($project, 'moved_from');
                $sender->sendToUser($oldClient, $title, $message);
            }
            if ($newClient = User::find($validated['client_id'])) {
                [$title, $message] = $this->formatProjectMessage($project, 'moved_to');
                $sender->sendToUser($newClient, $title, $message);
            }
        } else {
            // client sama, tapi nama/deskripsi mungkin berubah → kabari client aktif
            if ($currentClient = User::find($project->client_id)) {
                [$title, $message] = $this->formatProjectMessage($project, 'updated');
                $sender->sendToUser($currentClient, $title, $message);
            }
        }

        return redirect()->route('projects.index')->with('success', 'Project berhasil diperbarui.');
    }

    // delete + notif ke client aktif
    public function destroy(Project $project, NotificationSenderService $sender)
    {
        $client = $project->client_id ? User::find($project->client_id) : null;

        // simpan info untuk pesan sebelum dihapus
        $snapshot = clone $project;

        $project->delete();

        if ($client) {
            [$title, $message] = $this->formatProjectMessage($snapshot, 'deleted');
            $sender->sendToUser($client, $title, $message);
        }

        return redirect()->route('projects.index')->with('success', 'Project berhasil dihapus.');
    }

    public function create(): Response
    {
        $clients = User::where('role', UserRole::Client->value)->get();
        return Inertia::render('admin/project-form', ['clients' => $clients]);
    }

    public function edit(Project $project): Response
    {
        $clients = User::where('role', UserRole::Client->value)->get();
        return Inertia::render('admin/project-form', [
            'project' => $project,
            'clients' => $clients
        ]);
    }
}
