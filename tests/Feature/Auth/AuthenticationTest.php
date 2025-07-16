<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/** @test */
it('can register a user successfully', function () {
    $response = $this->postJson('/register', [
        'name'                  => 'Afzaal',
        'email'                 => 'afzaal@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201);
    $response->assertJsonStructure([
        'message',
        'user' => ['id', 'name', 'email', 'role']
    ]);

    expect(User::count())->toBe(1);
});

/** @test */
it('fails to register with invalid data', function () {
    $response = $this->postJson('/register', [
        'name'  => '',
        'email' => 'not-an-email',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['name', 'email', 'password']);
});

/** @test */
it('can login with correct credentials', function () {
    $user = User::factory()->create([
        'email'    => 'login@example.com',
        'password' => Hash::make('secret123'),
    ]);

    $response = $this->postJson('/login', [
        'email'    => 'login@example.com',
        'password' => 'secret123',
    ]);

    $response->assertStatus(200);
    $response->assertJsonFragment(['message' => 'Login berhasil']);
});

/** @test */
it('fails to login with wrong credentials', function () {
    $user = User::factory()->create([
        'email'    => 'wrong@example.com',
        'password' => Hash::make('correctpass'),
    ]);

    $response = $this->postJson('/login', [
        'email'    => 'wrong@example.com',
        'password' => 'wrongpass',
    ]);

    $response->assertStatus(401);
    $response->assertJsonFragment(['message' => 'Login gagal: email atau password salah']);
});

/** @test */
it('can logout successfully', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->postJson('/logout');

    $response->assertStatus(200);
    $response->assertJson(['message' => 'Logout berhasil']);
});

/** @test */
it('can retrieve current authenticated user', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/me');

    $response->assertStatus(200);
    $response->assertJsonFragment([
        'email' => $user->email,
        'name'  => $user->name,
    ]);
});
