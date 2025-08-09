<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\User;
use App\Services\WablasService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class CustomerServiceController extends Controller
{
    protected $wablasService;

    public function __construct(WablasService $wablasService)
    {
        $this->wablasService = $wablasService;
    }

    // Mengambil riwayat pesan
    public function fetchMessages()
    {
        $user = Auth::user();
        $admin = User::where('role', 'admin')->first();

        if (!$admin) {
            return response()->json([]);
        }

        $messages = ChatMessage::where(function ($query) use ($user, $admin) {
            $query->where('sender_id', $user->id)->where('receiver_id', $admin->id);
        })->orWhere(function ($query) use ($user, $admin) {
            $query->where('sender_id', $admin->id)->where('receiver_id', $user->id);
        })->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }
        // Ambil semua client yang pernah chat
    public function fetchClients()
    {
        return User::where('role', 'client')->select('id', 'name')->get();
    }

    // Ambil semua pesan antara admin & client
    public function fetchMessagesForClient($clientId)
    {
        $admin = Auth::user();
        $role = $admin->role instanceof \App\Enums\UserRole ? strtolower($admin->role->value) : strtolower((string) $admin->role);
    if ($role !== 'admin') {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

        return ChatMessage::where(function ($query) use ($clientId, $admin) {
            $query->where('sender_id', $clientId)->where('receiver_id', $admin->id);
        })->orWhere(function ($query) use ($clientId, $admin) {
            $query->where('sender_id', $admin->id)->where('receiver_id', $clientId);
        })->orderBy('created_at', 'asc')->get();
    }

    // Mengirim pesan baru
    public function sendMessage(Request $request)
    {
        $request->validate(['message' => 'required|string']);

        $user = Auth::user();
        $admin = User::where('role', 'admin')->first();

        if (!$admin) {
            return response()->json(['error' => 'Admin tidak ditemukan.'], 404);
        }

        $message = ChatMessage::create([
            'sender_id' => $user->id,
            'receiver_id' => $admin->id,
            'message' => $request->message,
        ]);

        // Kirim notifikasi WhatsApp ke Admin
        $csNumber = config('wablas.cs_number');
        if ($csNumber) {
            $notificationMessage = "Pesan baru dari {$user->name}:\n\n{$request->message}";
            $this->wablasService->sendMessage($csNumber, $notificationMessage);
        }

        return response()->json($message);
    }

    // Cek status online admin
    public function getAdminStatus()
    {
        $admin = User::where('role', 'admin')->first();
        $isOnline = $admin ? Cache::has('user-is-online-' . $admin->id) : false;
        return response()->json(['isOnline' => $isOnline]);
    }
    // ADMIN mengirim pesan ke client
    public function adminSendMessage(Request $request, $clientId)
    {
        $request->validate(['message' => 'required|string']);

        $admin = Auth::user();
        $role = $admin->role instanceof \App\Enums\UserRole ? strtolower($admin->role->value) : strtolower((string) $admin->role);
    if ($role !== 'admin') {
        return response()->json(['error' => 'Unauthorized'], 403);
    }


        $client = User::findOrFail($clientId);

        $message = ChatMessage::create([
            'sender_id' => $admin->id,
            'receiver_id' => $client->id,
            'message' => $request->message,
        ]);

        // Kirim ke WhatsApp client
        if ($client->phone) {
            $this->wablasService->sendMessage($client->phone, "Balasan dari Admin:\n\n{$request->message}");
        }

        return response()->json($message);
    }
}

