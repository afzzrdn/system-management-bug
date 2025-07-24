<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Enums\UserRole;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'     => 'Admin User',
                'password' => Hash::make('password'),
                'role'     => UserRole::Admin,
            ]
        );

        User::firstOrCreate(
            ['email' => 'dev@example.com'],
            [
                'name'     => 'Developer User',
                'password' => Hash::make('password'),
                'role'     => UserRole::Developer,
            ]
        );

        User::firstOrCreate(
            ['email' => 'client@example.com'],
            [
                'name'     => 'Client User',
                'password' => Hash::make('password'),
                'role'     => UserRole::Client,
            ]
        );
    }
}
