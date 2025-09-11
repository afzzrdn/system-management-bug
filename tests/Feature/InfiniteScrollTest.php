<?php

use App\Models\User;
use App\Models\Project;
use App\Models\Bug;
use App\Enums\BugType;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('infinite scroll API returns paginated bugs for JSON request', function () {
    // Create a client user
    $client = User::factory()->create([
        'role' => 'client',
        'email' => 'client@test.com',
    ]);

    // Create a project for this client
    $project = Project::factory()->create([
        'client_id' => $client->id,
    ]);

    // Create 25 bugs for testing pagination
    Bug::factory(25)->create([
        'reported_by' => $client->id,
        'project_id' => $project->id,
        'status' => 'open',
        'type' => BugType::Lainnya->value,
    ]);

    // Request the first page via AJAX
    $response = $this->actingAs($client)
        ->get(route('client.bugs.index', ['page' => 1]), [
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ]);

    $response->assertStatus(200);
    
    // Check JSON response structure
    $response->assertJsonStructure([
        'bugs',
        'has_more',
        'next_page',
    ]);

    $bugs = $response->json('bugs');
    expect(count($bugs))->toBe(10); // Should get 10 bugs per page
    
    $response->assertJson([
        'has_more' => true,
        'next_page' => 2,
    ]);
});

test('infinite scroll API returns random bugs when load_random is true', function () {
    // Create a client user
    $client = User::factory()->create([
        'role' => 'client',
        'email' => 'client@test.com',
    ]);

    // Create a project for this client
    $project = Project::factory()->create([
        'client_id' => $client->id,
    ]);

    // Create 20 bugs for testing
    Bug::factory(20)->create([
        'reported_by' => $client->id,
        'project_id' => $project->id,
        'status' => 'open',
        'type' => BugType::Lainnya->value,
    ]);

    // Request random bugs via AJAX
    $response = $this->actingAs($client)
        ->get(route('client.bugs.index', ['load_random' => 'true']), [
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ]);

    $response->assertStatus(200);
    
    // Check JSON response structure
    $response->assertJsonStructure([
        'bugs',
        'has_more',
        'next_page',
    ]);

    $response->assertJson([
        'has_more' => true,
        'next_page' => null, // Random loading doesn't use pagination
    ]);

    // Should return up to 10 bugs
    $bugs = $response->json('bugs');
    expect(count($bugs))->toBeLessThanOrEqual(10);
});

test('infinite scroll API handles pagination correctly', function () {
    // Create a client user
    $client = User::factory()->create([
        'role' => 'client',
        'email' => 'client@test.com',
    ]);

    // Create a project for this client
    $project = Project::factory()->create([
        'client_id' => $client->id,
    ]);

    // Create exactly 25 bugs
    Bug::factory(25)->create([
        'reported_by' => $client->id,
        'project_id' => $project->id,
        'status' => 'open',
        'type' => BugType::Lainnya->value,
    ]);

    // Request page 2
    $response = $this->actingAs($client)
        ->get(route('client.bugs.index', ['page' => 2]), [
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ]);

    $response->assertStatus(200);
    
    // Check JSON response
    $response->assertJsonStructure([
        'bugs',
        'has_more',
        'next_page',
    ]);

    $bugs = $response->json('bugs');
    expect(count($bugs))->toBe(10); // Second page should have 10 bugs

    // Page 3 request
    $response = $this->actingAs($client)
        ->get(route('client.bugs.index', ['page' => 3]), [
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ]);

    $bugs = $response->json('bugs');
    expect(count($bugs))->toBe(5); // Third page should have 5 remaining bugs
    
    $response->assertJson([
        'has_more' => false, // No more pages
        'next_page' => null,
    ]);
});

test('infinite scroll API only returns client own bugs', function () {
    // Create two clients
    $client1 = User::factory()->create([
        'role' => 'client',
        'email' => 'client1@test.com',
    ]);
    
    $client2 = User::factory()->create([
        'role' => 'client',
        'email' => 'client2@test.com',
    ]);

    // Create projects for each client
    $project1 = Project::factory()->create(['client_id' => $client1->id]);
    $project2 = Project::factory()->create(['client_id' => $client2->id]);

    // Create bugs for each client
    Bug::factory(5)->create([
        'reported_by' => $client1->id,
        'project_id' => $project1->id,
        'status' => 'open',
        'type' => BugType::Lainnya->value,
    ]);

    Bug::factory(5)->create([
        'reported_by' => $client2->id,
        'project_id' => $project2->id,
        'status' => 'open',
        'type' => BugType::Lainnya->value,
    ]);

    // Client 1 should only see their own bugs
    $response = $this->actingAs($client1)
        ->get(route('client.bugs.index'), [
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ]);

    $response->assertStatus(200);
    
    $bugs = $response->json('bugs');
    expect(count($bugs))->toBe(5);
    
    // Verify all bugs belong to client1
    foreach ($bugs as $bug) {
        expect($bug['reported_by'])->toBe($client1->id->toString());
    }
});