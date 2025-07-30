<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bug;
use App\Models\Project;
use App\Models\User;

class BugSeeder extends Seeder
{
    public function run(): void
    {
        $reporter = User::where('email', 'client@example.com')->first();
        $projects = Project::all();

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
                Bug::firstOrCreate(
                    [
                        'title' => $titles[array_rand($titles)] . " ({$project->name})",
                    ],
                    [
                        'description' => 'Deskripsi detail bug untuk project ' . $project->name . '.',
                        'priority' => ['low', 'medium', 'high', 'critical'][array_rand(['low', 'medium', 'high', 'critical'])],
                        'status' => ['open', 'in_progress', 'resolved'][array_rand(['open', 'in_progress', 'resolved'])],
                        'project_id' => $project->id,
                        'reported_by' => $reporter?->id,
                    ]
                );
            }
        }
    }
}
