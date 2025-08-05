<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Str;

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
                    ['title' => $titles[array_rand($titles)] . " ({$project->name})"],
                    [
                        'id' => Str::uuid(),
                        'description' => 'Deskripsi detail bug untuk project ' . $project->name . '.',
                        'priority' => ['low', 'medium', 'high', 'critical'][array_rand([0,1,2,3])],
                        'status' => ['open', 'in_progress', 'resolved'][array_rand([0,1,2])],
                        'project_id' => $project->id,
                        'reported_by' => $reporter->id,
                    ]
                );
            }
        }
    }
}
