<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PegawaiController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Dashboard Stats
    Route::get('/dashboard/stats', [PegawaiController::class, 'stats']);

    // Pegawai CRUD
    Route::apiResource('pegawai', PegawaiController::class);
    
    // You can add more routes here based on the PRD: 
    // CareerController, OrgChartController, ReimbursementController, etc.
});
