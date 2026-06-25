<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\OtpToken;

class AuthController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        // Mocking user verification and OTP generation as scaffolding
        // $user = User::where('email', $request->email)->where('is_active', true)->firstOrFail();
        
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // OtpToken::where('user_id', $user->id)->delete();
        // OtpToken::create([...]);
        
        // Mail::to($request->email)->send(...);
        
        return response()->json([
            'success' => true,
            'message' => 'OTP dikirim ke email Anda. (Scaffold)',
            'mock_otp' => $otp
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6'
        ]);
        
        // Mocking token verification
        // $user = User::where('email', $request->email)->firstOrFail();
        // $sanctumToken = $user->createToken('insan-apu')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => 'mock_sanctum_token_12345',
            'message' => 'Verifikasi berhasil (Scaffold)'
        ]);
    }

    public function logout(Request $request)
    {
        // $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ]);
    }
}
