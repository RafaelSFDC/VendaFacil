<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/index');
    }

    public function profile()
    {
        return Inertia::render('settings/profile', [
            'user' => Auth::user(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Perfil atualizado com sucesso!');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        Auth::user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Senha alterada com sucesso!');
    }

    public function system()
    {
        // Estatísticas do sistema
        $stats = [
            'total_users' => User::count(),
            'database_size' => $this->getDatabaseSize(),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'storage_used' => $this->getStorageUsed(),
        ];

        return Inertia::render('settings/system', [
            'stats' => $stats,
        ]);
    }

    public function backup()
    {
        return Inertia::render('settings/backup');
    }

    private function getDatabaseSize()
    {
        try {
            $size = DB::select("
                SELECT
                    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
                FROM information_schema.tables
                WHERE table_schema = DATABASE()
            ");

            return $size[0]->size_mb ?? 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    private function getStorageUsed()
    {
        try {
            $bytes = 0;
            $path = storage_path();

            if (is_dir($path)) {
                foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path)) as $file) {
                    if ($file->isFile()) {
                        $bytes += $file->getSize();
                    }
                }
            }

            return round($bytes / 1024 / 1024, 2); // MB
        } catch (\Exception $e) {
            return 0;
        }
    }
}
