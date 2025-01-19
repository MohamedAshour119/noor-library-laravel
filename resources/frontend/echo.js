import Echo from 'laravel-echo';
import Pusher from "pusher-js";

// Initialize Pusher and Echo
window.Pusher = Pusher;
Pusher.logToConsole = true;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
});

// Use the Echo instance from `window`
const channel = window.Echo.channel('chat');

// Listen for events on the channel
channel.listen('.message-sent', (data) => {
    alert(JSON.stringify(data));
});

// Debug: Log state changes and errors
window.Echo.connector.pusher.connection.bind('state_change', (states) => {
    console.log('Pusher state change:', states);
});

window.Echo.connector.pusher.connection.bind('error', (err) => {
    console.error('Pusher connection error:', err);
});
