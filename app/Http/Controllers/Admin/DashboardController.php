<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $userCount = User::count();

        return Inertia::render('admin/dashboard', [
            'userCount' => $userCount,
            // Anda bisa menambahkan data lain untuk kartu statistik lainnya di sini
            // 'expiringSoonCount' => ...
            // 'needValidationCount' => ...
        ]);
    }
}