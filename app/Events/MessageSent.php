<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel
     */
    public function broadcastOn()
    {
        info('Broadcasting message to channel "chat" with message: ' . $this->message);

        return new Channel('chat');
//        return new PrivateChannel('chat');
    }

    /**
     * Data to broadcast with the event.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'message' => $this->message,
        ];
    }

    /**
     * The name of the event for broadcasting.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'message-sent';
    }
}
