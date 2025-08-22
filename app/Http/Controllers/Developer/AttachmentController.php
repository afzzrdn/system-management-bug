<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use App\Models\Bug;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    public function index(Bug $bug)
{
    $this->authorizeBug($bug);

    $attachments = $bug->attachments()
        ->get(['id','file_name','file_path','mime','size','uploaded_by','created_at']);

    return response()->json(['attachments' => $attachments]);
}

public function store(Request $r, Bug $bug)
{
    $this->authorizeBug($bug);

    $r->validate([
        'files.*' => ['required','file','max:10240','mimes:png,jpg,jpeg,webp,gif,mp4,webm,pdf,txt,log'],
    ]);

    $saved = [];
    foreach ($r->file('files', []) as $file) {
        $path = $file->store("attachments/{$bug->id}", 'public');

        $att = Attachment::create([
            'bug_id'      => $bug->id,
            'uploaded_by' => Auth::id(),
            'file_path'   => $path,
            'file_name'   => $file->getClientOriginalName(),
            'mime'        => $file->getClientMimeType(),
            'size'        => $file->getSize(),
        ]);

        $saved[] = $att;
    }

    return response()->json(['ok' => true, 'attachments' => $saved], 201);
}
    public function destroy(Attachment $attachment)
    {
        abort_unless(optional($attachment->bug)->assigned_to === Auth::id(), 403);

        if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }
        $attachment->delete();

        return response()->json(['ok'=>true]);
    }

    private function authorizeBug(Bug $bug) {
        abort_unless($bug->assigned_to === Auth::id(), 403);
    }
}
