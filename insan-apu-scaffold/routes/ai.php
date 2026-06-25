<?php

use App\Mcp\Servers\HrisServer;
use Laravel\Mcp\Facades\Mcp;

/*
|--------------------------------------------------------------------------
| AI & MCP Routes
|--------------------------------------------------------------------------
|
| Here is where you can register AI Model Context Protocol (MCP) servers
| for your application. These routes are loaded by the RouteServiceProvider
| or bootstrap/app.php in modern Laravel.
|
*/

Mcp::web('/mcp/hris', HrisServer::class)->middleware('api');
Mcp::local('hris', HrisServer::class);
