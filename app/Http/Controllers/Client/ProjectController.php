<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('client_id', Auth::id())
            ->withCount('bugs')
            ->latest()
            ->get();

        return Inertia::render('client/project', [
            'projects' => $projects
        ]);
    }

    public function show(Project $project)
    {
        if ($project->client_id !== Auth::id()) {
            abort(403, 'AKSES DITOLAK');
        }

       $project->load([
            'client:id,name',
            'bugs' => function ($q) {
                $q->with(['attachments:id,bug_id,file_path'])
                ->orderBy('created_at', 'desc');
            }
        ]);

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

        // mapping attachments -> file_url
        $project->bugs->each(function ($bug) {
            $bug->attachments->transform(function ($att) {
                $att->file_url = url('storage/' . $att->file_path);
                return $att;
            });
        });


        return response()->json([
            'project' => $project
        ]);
    }
}
