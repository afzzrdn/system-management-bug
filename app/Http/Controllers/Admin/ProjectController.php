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
    // Tampilkan daftar semua project
    public function index(): Response
    {
        $projects = Project::with('client')->latest()->get();
        $clients = User::where('role', UserRole::Client->value)->get();

        return Inertia::render('admin/project', [
            'projects' => $projects,
            'clients' => $clients,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    public function create(): Response
    {
        $clients = User::where('role', UserRole::Client->value)->get();

        return Inertia::render('admin/project', [
            'clients' => $clients
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

        return redirect()->route('projects.index')->with('success', 'Project berhasil dibuat.');
    }

    // Tampilkan detail project
    public function show(Project $project): Response
    {
        $project->load('client', 'bugs');

        return Inertia::render('admin/project', [
            'project' => $project
        ]);
    }

    // Tampilkan form edit project
    public function edit(Project $project): Response
    {
        $clients = User::where('role', UserRole::Client->value)->get();

        return Inertia::render('admin/project', [
            'project' => $project,
            'clients' => $clients
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
}
