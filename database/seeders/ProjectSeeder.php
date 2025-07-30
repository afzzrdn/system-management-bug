<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::where('email', 'client@example.com')->first();

        Project::firstOrCreate(
            ['name' => 'Website E-Commerce'],
            [
                'description' => 'Project pengembangan website e-commerce untuk client.',
                'client_id' => $client?->id,
            ]
        );

        Project::firstOrCreate(
            ['name' => 'Mobile App Bug Tracker'],
            [
                'description' => 'Project aplikasi mobile untuk tracking bug.',
                'client_id' => $client?->id,
            ]
        );

        Project::firstOrCreate(
            ['name' => 'Company Profile Website'],
            [
                'description' => 'Project website profil perusahaan.',
                'client_id' => $client?->id,
            ]
        );
    }
}
