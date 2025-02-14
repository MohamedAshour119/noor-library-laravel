<?php

namespace App\Http\Controllers;

use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Pusher\Pusher;
use Illuminate\Support\Facades\Log;
use Exception;

class AIChatController extends Controller
{
    use HttpResponses;

    public function sendMessage(Request $request)
    {
        $message = $request->input('message');
        $apiKey = config('app.huggingface_api_key');
    
        if (!$apiKey) {
            return $this->response_error('API key is missing', [], 500);
        }
    
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
            ])->post('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', [
                'inputs' => [
                    'text' => $message,
                    'past_user_inputs' => [],
                    'generated_responses' => []
                ]
            ]);
    
            $responseData = $response->json();
            
            // Handle model loading scenario
            if (isset($responseData['error']) && $responseData['error'] === 'Model microsoft/DialoGPT-medium is currently loading') {
                return $this->response_error('AI is warming up. Please try again in 20 seconds.', [], 503);
            }
            
            // Extract generated text from response
            $aiResponse = $responseData[0]['generated_text'] ?? 'Sorry, I had trouble understanding that.';
    
            Log::info('AI Response:', [$aiResponse]);
    
        } catch (Exception $e) {
            Log::error('AI Service Error:', ['error' => $e->getMessage()]);
            return $this->response_error('AI service is currently unavailable. Please try again later.', [], 500);
        }
    
        // Send response to Pusher
        try {
            $pusher = new Pusher(
                config('broadcasting.connections.pusher.key'),
                config('broadcasting.connections.pusher.secret'),
                config('broadcasting.connections.pusher.app_id'),
                [
                    'cluster' => config('broadcasting.connections.pusher.options.cluster'),
                    'useTLS' => true,
                ]
            );
    
            $pusher->trigger('chat-channel', 'new-message', [
                'sender' => 'ai',
                'message' => $aiResponse,
            ]);
    
        } catch (Exception $e) {
            Log::error('Pusher Error:', ['error' => $e->getMessage()]);
            return $this->response_error('Failed to send message via Pusher.', [], 500);
        }
    
        return $this->response_success(['message' => $aiResponse], 'Message sent');
    }
}