<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\WablasService;
use App\Models\InboundMessage;

class WablasController extends Controller
{
    protected $wablas;

    public function __construct(WablasService $wablas)
    {
        $this->wablas = $wablas;
    }

    /**
     * Cek status device & token
     */
    public function checkStatus()
    {
        $status = $this->wablas->checkStatus();
        return response()->json($status);
    }

    /**
     * Kirim pesan WA untuk testing
     */
    public function sendTestMessage(Request $request)
    {
        $request->validate([
            'phone' => 'required',
            'message' => 'required'
        ]);

        $response = $this->wablas->sendMessage($request->phone, $request->message);
        return response()->json($response);
    }

}
