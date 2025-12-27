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
        $admin = User::where('email', 'admin@example.com')->first();
        if (!$reporter || !$admin) {
            $this->command->warn('Client or admin user not found. Skipping BugSeeder.');
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
            // 1 pending bug (belum disetujui)
            $pendingCreated = Carbon::now()->subDays(rand(1, 5));
            Bug::create([
                'id' => Str::uuid(),
                'title' => $titles[array_rand($titles)] . " ({$project->name})",
                'description' => 'Laporan menunggu persetujuan admin.',
                'priority' => 'low',
                'status' => 'pending',
                'type' => BugType::Lainnya->value,
                'project_id' => $project->id,
                'reported_by' => $reporter->id,
                'assigned_to' => null,
                'is_approved' => false,
                'approved_at' => null,
                'approved_by' => null,
                'created_at' => $pendingCreated,
                'updated_at' => $pendingCreated,
                'due_at' => null,
                'schedule_start_at' => null,
                'resolved_at' => null,
            ]);

            // 4 approved bugs with varied statuses
            foreach (['open', 'in_progress', 'resolved', 'open'] as $status) {
                $createdAt = Carbon::now()->subDays(rand(6, 30));
                $assignedDev = $developers->isNotEmpty() ? $developers->random()->id : null;
                $scheduleStart = null;
                $dueAt = null;
                $resolvedAt = null;

                if (in_array($status, ['in_progress', 'resolved'], true)) {
                    $scheduleStart = (clone $createdAt)->addHours(rand(4, 12));
                    $dueAt = (clone $scheduleStart)->addDays(rand(2, 7));
                    if ($status === 'resolved') {
                        $resolvedAt = (clone $scheduleStart)->addDays(rand(1, 3));
                    }
                    if (!$assignedDev) {
                        $assignedDev = $developers->first()?->id;
                    }
                } else {
                    $dueAt = (clone $createdAt)->addDays(rand(3, 10));
                }

                Bug::create([
                    'id' => Str::uuid(),
                    'title' => $titles[array_rand($titles)] . " ({$project->name})",
                    'description' => 'Ini adalah deskripsi detail untuk bug yang dilaporkan pada project ' . $project->name . '.',
                    'priority' => ['low', 'medium', 'high', 'critical'][array_rand([0,1,2,3])],
                    'status' => $status,
                    'type' => collect(BugType::cases())->random()->value,
                    'project_id' => $project->id,
                    'reported_by' => $reporter->id,
                    'assigned_to' => $assignedDev,
                    'is_approved' => true,
                    'approved_at' => (clone $createdAt)->addHours(1),
                    'approved_by' => $admin->id,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt->copy()->addHours(rand(2, 24)),
                    'schedule_start_at' => $scheduleStart,
                    'due_at' => $dueAt,
                    'resolved_at' => $resolvedAt,
                ]);
            }
        }
    }
}
