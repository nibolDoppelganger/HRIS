<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use Illuminate\Http\Request;

class PegawaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pegawais = Pegawai::all();
        return response()->json([
            'success' => true,
            'data' => $pegawais
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string|unique:pegawais',
            'full_name' => 'required|string|max:255',
            'department' => 'required|string',
            'employment_status' => 'required|string',
            'job_level' => 'required|integer',
        ]);

        $pegawai = Pegawai::create($validated);

        return response()->json([
            'success' => true,
            'data' => $pegawai,
            'message' => 'Pegawai berhasil ditambahkan'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pegawai = Pegawai::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $pegawai
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pegawai = Pegawai::findOrFail($id);
        $pegawai->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $pegawai,
            'message' => 'Data pegawai berhasil diupdate'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pegawai = Pegawai::findOrFail($id);
        $pegawai->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pegawai berhasil dinonaktifkan (Soft Delete)'
        ]);
    }

    /**
     * Get Dashboard Stats
     */
    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'TOTAL_AKTIF' => Pegawai::where('is_active', true)->count(),
                'TOTAL_TETAP' => Pegawai::where('employment_status', 'Tetap')->count(),
                'TOTAL_KONTRAK' => Pegawai::where('employment_status', 'Kontrak')->count(),
                'TOTAL_RELAWAN' => Pegawai::where('employment_status', 'Relawan')->count(),
            ]
        ]);
    }
}
