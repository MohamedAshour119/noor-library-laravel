<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    use HttpResponses;

    public function sendMessage(Request $request)
    {
        $validated_message = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        broadcast(new MessageSent($validated_message['message']))->toOthers();
        return $this->response_success([], 'Message sent successfully!');
    }
}
