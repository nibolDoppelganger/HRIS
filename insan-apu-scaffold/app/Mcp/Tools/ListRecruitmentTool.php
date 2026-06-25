<?php

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;
use Illuminate\Support\Facades\DB;

#[Description('Lists ongoing volunteer recruitment campaigns and candidate counts.')]
class ListRecruitmentTool extends Tool
{
    /**
     * Define the tool's input schema.
     */
    public function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'status' => [
                    'type' => 'string',
                    'description' => 'Optional status filter (e.g. "Draft", "Terbuka", "Seleksi", "Selesai"). Default is Terbuka.',
                ],
            ],
        ];
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Response
    {
        $status = $request->argument('status') ?? 'Terbuka';
        
        // Since we don't have the Rekrutmen model fully scaffolded yet, we can use DB facade
        // assuming standard naming convention for the table based on PRD.
        try {
            $campaigns = DB::table('rekrutmen_campaigns')
                ->where('status', $status)
                ->get();
                
            if ($campaigns->isEmpty()) {
                return Response::text("No recruitment campaigns found with status: {$status}");
            }

            $formatted = $campaigns->map(function ($c) {
                return "- [{$c->id}] {$c->judul} (Target: {$c->kuota} orang)\n  Periode: {$c->tanggal_mulai} s/d {$c->tanggal_selesai}";
            })->implode("\n\n");

            return Response::text("Recruitment Campaigns ({$status}):\n\n" . $formatted);
        } catch (\Exception $e) {
            return Response::text("Failed to fetch campaigns. Ensure the rekrutmen tables are migrated. Error: " . $e->getMessage());
        }
    }
}
