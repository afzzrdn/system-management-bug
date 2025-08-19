<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Str;
use App\Enums\BugType;
use Carbon\Carbon;

class BugSeeder extends Seeder
{
    public function run(): void
    {
        $reporter = User::where('email', 'client@example.com')->first();
        if (!$reporter) {
            $this->command->warn('Client user not found. Skipping BugSeeder.');
            return;
        }

        $projects = Project::all();
        $developers = User::where('role', 'developer')->get();

        $titles = [
            'Error login pada halaman utama',
            'Tampilan dashboard tidak responsive',
            'Crash saat upload file berukuran besar',
            'Perhitungan total harga tidak sesuai',
            'Bug pada fitur pencarian produk',
            'API timeout ketika request data project',
            'Tombol simpan tidak berfungsi di form edit',
            'Filter data tidak mengembalikan hasil yang benar',
        ];

        foreach ($projects as $project) {
            foreach (range(1, 5) as $i) {
                $status = collect(['open', 'in_progress', 'resolved'])->random();
                $createdAt = Carbon::now()->subDays(rand(1, 30));

                $data = [
                    'id' => Str::uuid(),
                    'title' => $titles[array_rand($titles)] . " ({$project->name})",
                    'description' => 'Ini adalah deskripsi detail untuk bug yang dilaporkan pada project ' . $project->name . '. Mohon segera ditindaklanjuti oleh tim developer.',
                    'priority' => ['low', 'medium', 'high', 'critical'][array_rand([0,1,2,3])],
                    'status' => $status,
                    'type' => collect(BugType::cases())->random()->value,
                    'project_id' => $project->id,
                    'reported_by' => $reporter->id,
                    'assigned_to' => $developers->isNotEmpty() ? $developers->random()->id : null,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt->addHours(rand(1, 24)),
                ];

                switch ($status) {
                    case 'in_progress':
                        $data['schedule_start_at'] = (clone $createdAt)->addHours(rand(2, 6));
                        $data['due_at'] = (clone $data['schedule_start_at'])->addDays(rand(3, 10));
                        break;

                    case 'resolved':
                        $data['schedule_start_at'] = (clone $createdAt)->addHours(rand(2, 6));
                        $data['due_at'] = (clone $data['schedule_start_at'])->addDays(rand(3, 7));
                        $data['resolved_at'] = (clone $data['schedule_start_at'])->addDays(rand(1, 2));

                    case 'open':
                    default:
                        $data['schedule_start_at'] = null;
                        $data['resolved_at'] = null;
                        $data['due_at'] = (clone $createdAt)->addDays(rand(5, 15));
                        $data['assigned_to'] = null;
                        break;
                }

                Bug::create($data);
            }
        }
    }
}
