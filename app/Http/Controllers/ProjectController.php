<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use App\Enums\UserRole;

class ProjectController extends Controller
{
    // Tampilkan daftar semua project
    public function index()
    {
        $projects = Project::with('client')->latest()->get();
        return view('projects.index', compact('projects'));
    }

    // Tampilkan form untuk membuat project baru
    public function create()
    {
        // Ambil semua client (role: client)
        $clients = User::where('role', UserRole::Client->value)->get();
        return view('projects.create', compact('clients'));
    }

    // Simpan project baru ke database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_id'   => 'required|exists:users,id',
        ]);

        Project::create($validated);

        return redirect()->route('projects.index')->with('success', 'Project berhasil dibuat.');
    }

    // Menampilkan detail 1 project (opsional)
    public function show(Project $project)
    {
        $project->load('client', 'bugs');
        return view('projects.show', compact('project'));
    }

    // Tampilkan form edit project
    public function edit(Project $project)
    {
        $clients = User::where('role', UserRole::Client->value)->get();
        return view('projects.edit', compact('project', 'clients'));
    }

    // Update data project
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_id'   => 'required|exists:users,id',
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
