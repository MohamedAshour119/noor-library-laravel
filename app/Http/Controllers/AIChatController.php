<?php

namespace App\Http\Controllers;

use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Pusher\Pusher;

class AIChatController extends Controller
{
    use HttpResponses;
    public function sendMessage(Request $request) 
    {
        $message = $request->input("message");

        $response = Http::post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                ['role' => 'user', 'content' => $message],
            ],
        ], [
            'Authorization' => 'Bearer YOUR_OPENAI_API_KEY',
        ]);

        $ai_response = $response->json()['choices'][0]['message']['content'] ?? 'Sorry, I could not process that.';

        // Send response to Pusher
        $pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'useTLS' => true,
            ]
        );

        $pusher->trigger('chat-channel', 'new-message', [
            'sender' => 'ai',
            'message' => $ai_response,
        ]);

        return $this->response_success([], 'Message sent');

    }
}
