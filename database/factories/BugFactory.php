<?php

namespace Database\Factories;

use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use App\Enums\BugType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bug>
 */
class BugFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Bug::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $reportedBy = User::factory()->create(['role' => 'client']);
        $project = Project::factory()->create(['client_id' => $reportedBy->id]);
        
        return [
            'id' => (string) Str::uuid(),
            'title' => fake()->sentence(6),
            'description' => fake()->paragraph(),
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'critical']),
            'status' => fake()->randomElement(['open', 'in_progress', 'resolved', 'closed']),
            'type' => fake()->randomElement(array_column(BugType::cases(), 'value')),
            'project_id' => $project->id,
            'reported_by' => $reportedBy->id,
            'assigned_to' => null,
            'schedule_start_at' => null,
            'due_at' => fake()->dateTimeBetween('now', '+30 days'),
            'resolved_at' => null,
            'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'updated_at' => now(),
        ];
    }

    /**
     * Indicate that the bug is assigned to a developer.
     */
    public function assigned(): static
    {
        return $this->state(fn (array $attributes) => [
            'assigned_to' => User::factory()->create(['role' => 'developer'])->id,
        ]);
    }

    /**
     * Indicate that the bug is resolved.
     */
    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'resolved',
            'resolved_at' => fake()->dateTimeBetween('-7 days', 'now'),
        ]);
    }

    /**
     * Indicate that the bug is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
            'schedule_start_at' => fake()->dateTimeBetween('-7 days', 'now'),
            'assigned_to' => User::factory()->create(['role' => 'developer'])->id,
        ]);
    }
}