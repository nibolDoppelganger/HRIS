<?php

namespace App\Mcp\Tools;

use App\Models\Pegawai;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Searches and retrieves detailed employee information from the HRIS system using their name or NIK.')]
class GetEmployeeDataTool extends Tool
{
    /**
     * Define the tool's input schema.
     */
    public function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'query' => [
                    'type' => 'string',
                    'description' => 'The name or NIK (Nomor Induk Karyawan) of the employee to search for.',
                ],
            ],
            'required' => ['query'],
        ];
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Response
    {
        $query = $request->argument('query');
        
        $pegawais = Pegawai::where('nama_lengkap', 'like', "%{$query}%")
                           ->orWhere('nik', 'like', "%{$query}%")
                           ->limit(5)
                           ->get();

        if ($pegawais->isEmpty()) {
            return Response::text("No employees found matching the query: {$query}");
        }

        $formatted = $pegawais->map(function ($p) {
            return "- [{$p->nik}] {$p->nama_lengkap}\n  Status: {$p->status_pegawai}\n  Posisi: {$p->jabatan} di {$p->departemen}\n  Email: {$p->email}";
        })->implode("\n\n");

        return Response::text("Found the following employees:\n\n" . $formatted);
    }
}
