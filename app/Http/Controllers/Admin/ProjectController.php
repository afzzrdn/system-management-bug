<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationSenderService; // Service ini diimpor tapi belum digunakan, bisa dikembangkan
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use App\Enums\UserRole;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    // Tampilkan daftar semua project
    public function index(): Response
    {
        // [MODIFIKASI] Tambahkan withCount('bugs') untuk menampilkan jumlah bug di halaman daftar
        $projects = Project::with('client')->withCount('bugs')->latest()->get();
        $clients = User::where('role', UserRole::Client->value)->get();

        return Inertia::render('admin/project', [
            'projects' => $projects,
            'clients' => $clients,
        ]);
    }

    // Simpan project baru ke database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_id'   => 'required|exists:users,id,role,' . UserRole::Client->value,
        ]);

        Project::create($validated);

        // [SARAN] Di sini Anda bisa menambahkan notifikasi ke client
        // $client = User::find($validated['client_id']);
        // NotificationSenderService::send('Project Baru Dibuat', 'Project ' . $validated['name'] . ' telah dibuat untuk Anda.', $client);

        return redirect()->route('projects.index')->with('success', 'Project berhasil dibuat.');
    }
    
    
    // [MODIFIKASI UTAMA] Tampilkan detail project dengan logika lengkap
    public function show(Project $project)
    {
        // 1. Load relasi yang lebih detail: client dan bugs beserta attachments-nya
        $project->load([
            'client:id,name',
            'bugs' => function ($query) {
                $query->with('attachments:id,bug_id,file_path')
                      ->orderBy('created_at', 'desc');
            }
        ]);

        // 2. Tambahkan logika versioning untuk setiap bug
        $major = 1;
        $minor = 0;
        $patch = 0;
        foreach ($project->bugs as $bug) {
            $bug->version = "{$major}.{$minor}.{$patch}";
            $patch++;
            if ($patch > 9) {
                $patch = 0;
                $minor++;
            }
            if ($minor > 9) {
                $minor = 0;
                $major++;
            }
        }

        // 3. Buat URL publik untuk setiap lampiran (attachment)
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

    // Update data project
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_id'   => 'required|exists:users,id,role,' . UserRole::Client->value,
        ]);

        $project->update($validated);

        return redirect()->route('projects.index')->with('success', 'Project berhasil diperbarui.');
    }

    // Hapus project
    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project berhasil dihapus.');
    }

    // Method 'create' dan 'edit' tidak perlu diubah
    public function create(): Response
    {
        $clients = User::where('role', UserRole::Client->value)->get();
        return Inertia::render('admin/project-form', ['clients' => $clients]); // Ganti nama view jika perlu
    }

    public function edit(Project $project): Response
    {
        $clients = User::where('role', UserRole::Client->value)->get();
        return Inertia::render('admin/project-form', [ // Ganti nama view jika perlu
            'project' => $project,
            'clients' => $clients
        ]);
    }
}