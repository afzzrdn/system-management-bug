<?php
namespace App\Services;

use App\Models\User;
use App\Models\Notification;
use App\Services\WablasService;

class NotificationSenderService
{
    protected $wablas;

    public function __construct(WablasService $wablas)
    {
        $this->wablas = $wablas;
    }

    /**
     * Kirim notifikasi ke user (simpan DB + WA)
     */
    public function sendToUser(User $user, string $title, string $message): Notification
    {
        $notif = Notification::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => $message,
            'is_read' => false,
        ]);

        if ($user->phone) {
            $this->wablas->sendMessage($user->phone, "*{$title}*\n{$message}");
        }

        return $notif;
    }
}
