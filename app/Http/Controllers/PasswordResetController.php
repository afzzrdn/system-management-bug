<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PasswordResetOtp;
use App\Services\WablasService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    protected $wablasService;

    public function __construct(WablasService $wablasService)
    {
        $this->wablasService = $wablasService;
    }

    /**
     * Tampilkan form forgot password
     */
    public function showForgotForm()
    {
        return Inertia::render('auth/forgot-password');
    }

    /**
     * Proses request reset password dan kirim OTP
     */
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'identifier' => 'required|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $identifier = $request->identifier;

        // Cari user berdasarkan email atau phone
        $user = User::where('email', $identifier)
                   ->orWhere('phone', $identifier)
                   ->first();

        if (!$user) {
            return back()->withErrors([
                'identifier' => 'Email atau nomor WhatsApp tidak ditemukan.'
            ]);
        }

        // Generate OTP dan token
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $token = Str::random(60);

        // Hapus OTP lama yang belum digunakan
        PasswordResetOtp::where('identifier', $identifier)->delete();

        // Simpan OTP baru
        PasswordResetOtp::create([
            'identifier' => $identifier,
            'otp' => $otp,
            'token' => $token,
            'expires_at' => Carbon::now()->addMinutes(10), // OTP berlaku 10 menit
        ]);

        // Kirim OTP
        $phoneNumber = null;
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            // Jika identifier adalah email, ambil nomor HP dari user tersebut
            $phoneNumber = $user->phone;
            if (!$phoneNumber) {
                return back()->withErrors([
                    'identifier' => 'Akun ini tidak memiliki nomor WhatsApp yang terdaftar.'
                ]);
            }
        } else {
            // Jika identifier adalah nomor HP
            $phoneNumber = $identifier;
        }

        // Kirim OTP via WhatsApp
        $message = "Kode OTP reset password BugReport Anda adalah: {$otp}\n\nKode ini berlaku selama 10 menit.";
        $result = $this->wablasService->sendMessage($phoneNumber, $message);
        $sent = isset($result['status']) && $result['status'] === true;

        if (!$sent) {
            return back()->withErrors([
                'identifier' => 'Gagal mengirim kode OTP ke WhatsApp. Pastikan nomor WhatsApp Anda aktif dan coba lagi.'
            ]);
        }

        return Inertia::render('auth/verify-otp', [
            'identifier' => $identifier
        ]);
    }

    /**
     * Tampilkan form verifikasi OTP
     */
    public function showVerifyForm(Request $request)
    {
        return Inertia::render('auth/verify-otp', [
            'identifier' => $request->query('identifier')
        ]);
    }

    /**
     * Verifikasi OTP
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'otp' => 'required|string|size:6',
            'identifier' => 'required|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $otpRecord = PasswordResetOtp::where('identifier', $request->identifier)
                                    ->where('otp', $request->otp)
                                    ->valid()
                                    ->first();

        if (!$otpRecord) {
            return back()->withErrors([
                'otp' => 'Kode OTP tidak valid atau sudah kadaluarsa.'
            ]);
        }

        return Inertia::render('auth/reset-password', [
            'token' => $otpRecord->token
        ]);
    }

    /**
     * Tampilkan form reset password
     */
    public function showResetForm(Request $request, $token)
    {
        $otpRecord = PasswordResetOtp::where('token', $token)->valid()->first();

        if (!$otpRecord) {
            return redirect()->route('login')->withErrors([
                'email' => 'Token reset password tidak valid atau sudah kadaluarsa.'
            ]);
        }

        return Inertia::render('auth/reset-password', [
            'token' => $token
        ]);
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $otpRecord = PasswordResetOtp::where('token', $request->token)->valid()->first();

        if (!$otpRecord) {
            return back()->withErrors([
                'token' => 'Token reset password tidak valid atau sudah kadaluarsa.'
            ]);
        }

        // Cari user
        $user = User::where('email', $otpRecord->identifier)
                   ->orWhere('phone', $otpRecord->identifier)
                   ->first();

        if (!$user) {
            return back()->withErrors([
                'token' => 'User tidak ditemukan.'
            ]);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Tandai OTP sebagai sudah digunakan
        $otpRecord->update(['is_used' => true]);

        return redirect()->route('login')->with('success', 'Password berhasil direset. Silakan login dengan password baru.');
    }
}
