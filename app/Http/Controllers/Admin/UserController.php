<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Menampilkan daftar pengguna dengan fungsionalitas pencarian dan filter.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('admin/users', [
            'users' => User::query()
                ->latest()
                // Menerapkan filter pencarian jika ada
                ->when($request->input('search'), function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->when($request->input('role'), function ($query, $role) {
                    $query->where('role', $role);
                })
                ->paginate(10)
                ->withQueryString()
                ->through(fn($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                ]),
            'filters' => $request->only(['search', 'role']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Menampilkan form untuk mengedit pengguna.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
            ],
            'roles' => array_map(fn($role) => ['value' => $role->value, 'label' => $role->name], UserRole::cases())
        ]);
    }

    /**
     * Memperbarui data pengguna di database.
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', new Enum(UserRole::class)],
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']); // Hapus dari array jika kosong
        }

        $user->update($data);

        return redirect()->route('users.index')
            ->with('success', 'User berhasil diupdate.');
    }

    /**
     * Menghapus pengguna dari database.
     */
    public function destroy(User $user)
    {
        // Mencegah pengguna menghapus akunnya sendiri
        if (Auth::id() === $user->id) {
            return redirect()->route('users.index')
                ->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User berhasil dihapus.');
    }
}
