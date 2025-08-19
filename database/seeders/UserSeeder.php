<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Enums\UserRole;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Admin User', 'email' => 'admin@example.com', 'role' => UserRole::Admin, 'phone' => '6285755836281'],
            ['name' => 'Afzaal Dev', 'email' => 'afzaal@example.com', 'role' => UserRole::Developer, 'phone' => '6287740174975'],
            ['name' => 'Satya Dev', 'email' => 'satya@example.com', 'role' => UserRole::Developer, 'phone' => '6285755836281'],
            ['name' => 'Developer User', 'email' => 'dev@example.com', 'role' => UserRole::Developer, 'phone' => '6285755836281'],
            ['name' => 'Client User', 'email' => 'client@example.com', 'role' => UserRole::Client, 'phone' => '6287740174975'],
        ];

        foreach ($users as $u) {
            User::firstOrCreate(
                ['email' => $u['email']],
                [
                    'id' => Str::uuid(),
                    'name' => $u['name'],
                    'password' => Hash::make('password'),
                    'role' => $u['role'],
                    'phone' => $u['phone'],
                ]
            );
        }
    }
}
