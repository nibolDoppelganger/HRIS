<?php

namespace App\Mcp\Servers;

use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;
use Laravel\Mcp\Server;
use App\Mcp\Tools\GetEmployeeDataTool;
use App\Mcp\Tools\ListRecruitmentTool;

#[Name('HRIS Server')]
#[Version('1.0.0')]
#[Instructions('This server provides information about employees and recruitment processes for SIMDP LAZWaf Al Azhar.')]
class HrisServer extends Server
{
    /**
     * The tools registered with this MCP server.
     *
     * @var array<int, class-string<\Laravel\Mcp\Server\Tool>>
     */
    protected array $tools = [
        GetEmployeeDataTool::class,
        ListRecruitmentTool::class,
    ];

    /**
     * The resources registered with this MCP server.
     *
     * @var array<int, class-string<\Laravel\Mcp\Server\Resource>>
     */
    protected array $resources = [
        // We can add read-only DB context here in the future
    ];

    /**
     * The prompts registered with this MCP server.
     *
     * @var array<int, class-string<\Laravel\Mcp\Server\Prompt>>
     */
    protected array $prompts = [
        // We can add prompt templates here in the future
    ];
}
