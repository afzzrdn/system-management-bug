<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::where('email', 'client@example.com')->first();

        $projects = [
            ['name' => 'Website E-Commerce', 'description' => 'Project pengembangan website e-commerce untuk client.'],
            ['name' => 'Mobile App Bug Tracker', 'description' => 'Project aplikasi mobile untuk tracking bug.'],
            ['name' => 'Company Profile Website', 'description' => 'Project website profil perusahaan.'],
        ];

        foreach ($projects as $p) {
            Project::firstOrCreate(
                ['name' => $p['name']],
                [
                    'id' => Str::uuid(),
                    'description' => $p['description'],
                    'client_id' => $client->id,
                ]
            );
        }
    }
}
