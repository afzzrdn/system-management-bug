<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WablasService
{
    protected $apiKey;
    protected $secretKey;
    protected $domain;

    public function __construct()
    {
        $this->apiKey = config('wablas.api_key');
        $this->secretKey = config('wablas.secret_key');
        $this->domain = config('wablas.domain');
    }

    /**
     * Cek status device & token
     */
    public function checkStatus()
    {
        $url = "https://{$this->domain}/api/device/info";

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey . '.' . $this->secretKey,
            ])->get($url);

            $data = $response->json();
            Log::info('Wablas Device Status:', $data ?? ['raw' => $response->body()]);

            if (!$response->successful()) {
                return ['status' => false, 'message' => 'Gagal menghubungi Wablas'];
            }

            // Jika status false
            if (isset($data['status']) && $data['status'] === false) {
                return ['status' => false, 'message' => $data['message'] ?? 'Token invalid atau device tidak aktif'];
            }

            return [
                'status' => true,
                'device_status' => $data['data']['status'] ?? 'UNKNOWN',
                'phone' => $data['data']['phone'] ?? null,
                'expired' => $data['data']['expired'] ?? null,
            ];

        } catch (\Exception $e) {
            Log::error('Failed to check Wablas status: ' . $e->getMessage());
            return ['status' => false, 'message' => 'Exception: ' . $e->getMessage()];
        }
    }

    /**
     * Kirim pesan WhatsApp
     */
    public function sendMessage($phoneNumber, $message)
    {
        if (!$this->apiKey || !$this->secretKey || !$this->domain) {
            Log::warning('Wablas credentials are not fully configured.');
            return ['status' => false, 'message' => 'Kredensial Wablas tidak lengkap.'];
        }

        $url = "https://{$this->domain}/api/send-message";

        // Payload tidak lagi memerlukan secret key
        $payload = [
            'phone'   => $phoneNumber,
            'message' => $message,
        ];

        try {
            // Gabungkan token dan secret key di header Authorization sesuai pengumuman
            $authToken = $this->apiKey . '.' . $this->secretKey;

            $response = Http::withHeaders([
                'Authorization' => $authToken,
            ])->post($url, $payload);

            Log::info('Wablas API Response:', $response->json() ?? ['raw' => $response->body()]);

            return $response->json();

        } catch (\Exception $e) {
            Log::error('Failed to send message via Wablas: ' . $e->getMessage());
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }
}
