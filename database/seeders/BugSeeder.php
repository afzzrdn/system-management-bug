<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Str;
use App\Enums\BugType;

class BugSeeder extends Seeder
{
    public function run(): void
    {
        $reporter = User::where('email', 'client@example.com')->first();
        $projects = Project::all();

        $developers = User::where('role', 'developer')->get();

        $titles = [
            'Error login pada halaman utama',
            'Tampilan dashboard tidak responsive',
            'Crash saat upload file berukuran besar',
            'Perhitungan total harga tidak sesuai',
            'Bug pada fitur pencarian produk',
            'API timeout ketika request data project',
        ];

        foreach ($projects as $project) {
            foreach (range(1, 3) as $i) {
                Bug::create([
                    'id' => Str::uuid(),
                    'title' => $titles[array_rand($titles)] . " ({$project->name})",
                    'description' => 'Deskripsi detail bug untuk project ' . $project->name . '.',
                    'priority' => ['low', 'medium', 'high', 'critical'][array_rand([0,1,2,3])],
                    'status' => ['open', 'in_progress', 'resolved', 'closed'][array_rand([0,1,2,3])],
                    'type' => collect(BugType::cases())->random()->value, // pilih BugType acak
                    'project_id' => $project->id,
                    'reported_by' => $reporter->id,
                    'assigned_to' => $developers->isNotEmpty() ? $developers->random()->id : null,
                    'resolved_at' => null,
                ]);
            }
        }
    }
}
