<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Enums\UserRole;

class CheckUserRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Ambil value dari enum (misalnya: 'admin')
        $userRole = $user->role instanceof UserRole
            ? $user->role->value
            : (string)$user->role;

        $allowedRoles = array_map('strtolower', $roles);

        if (!in_array(strtolower($userRole), $allowedRoles)) {
            abort(403, 'Akses ditolak: Role tidak diizinkan.');
        }

        return $next($request);
    }
}
