<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $userCount = User::count();

        return Inertia::render('dashboard', [
            'userCount' => $userCount,
            // Anda bisa menambahkan data lain untuk kartu statistik lainnya di sini
            // 'expiringSoonCount' => ...
            // 'needValidationCount' => ...
        ]);
    }
}