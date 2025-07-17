<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // POST /register
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|string|email|unique:users,email',
            'password'  => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => UserRole::Client, // Pastikan enum UserRole ada dengan case 'User'
        ]);

    }

    // POST /login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'     => 'required|email',
            'password'  => 'required|string'
        ]);

        if (!Auth::attempt($credentials)) {
            return back()->withErrors([
                'email' => 'Login gagal: email atau password salah',
            ]);
        }

        $role = Auth::user()->role instanceof \App\Enums\UserRole
        ? Auth::user()->role->value
        : Auth::user()->role;

        $redirectMap = [
            'admin' => '/admin/dashboard',
            'developer' => '/developer/dashboard',
            'client' => '/client/dashboard',
        ];

        return redirect()->to($redirectMap[$role] ?? '/dashboard');
    }   

    // POST /logout
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    // GET /me
    public function me()
    {
        return response()->json([
            'user' => Auth::user()
        ]);
    }
}
