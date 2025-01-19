import {IoChatbubbleEllipsesSharp} from "react-icons/io5";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import {IoMdClose, IoMdSend} from "react-icons/io";
import {useLocation} from "react-router-dom";
import apiClient from "../../ApiClient.ts";
interface Props {

}
export default function ChatSupport(props: Props) {
    const [is_open, setIs_open] = useState(false);
    const [not_display_in_routes, setNot_display_in_routes] = useState(true);
    const [show_scrollbar, setShow_scrollbar] = useState(false);
    const [messages, setMessages] = useState<String[]>([]);
    const [input_message, setInput_message] = useState('');

    useEffect(() => {

        // @ts-ignore
        window.Echo.connector.pusher.connection.bind('connected', () => {
            console.log('Pusher reconnected successfully.');
        });


        // @ts-ignore
        window.Echo.channel('chat').listen('.message-sent', (e: { message: string }) => {
            console.log('Event received:', e);
            setMessages(prev => [...prev, e.message]);

            return () => {
                // @ts-ignore
                window.Echo.leaveChannel('chat');
            }
        })


    }, []);
    const handleChangeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput_message(e.target.value)
    }
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (input_message.trim() === "") {
            return; // Do nothing if the message is empty
        }

        // Send message to the backend
        apiClient().post('/chat/send-message', { message: input_message.trim() })
            .then(() => {
                // Clear the input only after the message is sent
                setInput_message("");
            })
            .catch((err) => console.error("Failed to send message:", err));
    };

    const show_messages = messages.map(msg => (
        <div className={`flex items-start space-x-2 p-4`}>
            <img
                src="./support-bot.png"
                alt="Support Avatar"
                className={`w-10 h-10 rounded-full`}
            />
            <div className={`bg-second_main_color text-white rounded-lg p-3`}>
                <p className={`text-sm`}>
                    {msg}
                </p>
            </div>
        </div>
    ))

    const location = useLocation()

    useEffect(() => {
        const routes = ['/sign-up', '/sign-in']
        const current_location = location.pathname
        if (routes.includes(current_location)) {
            setNot_display_in_routes(false)
        }else {
            setNot_display_in_routes(true)
        }
    }, [location]);


    const toggleChat = () => {
        setIs_open(!is_open);
        if (!is_open) setMessages([]); // Clear messages when closing the chat
    };

    return (
        <div className={`bg-main_color_darker flex justify-center`}>
            <div className={`container`}>
                {!is_open && not_display_in_routes &&
                    <IoChatbubbleEllipsesSharp
                        onClick={toggleChat}
                        className={`text-second_main_color hover:text-second_main_color/90 size-12 cursor-pointer fixed bottom-4 z-50`}
                    />
                }

                <div className={`w-fit container fixed bottom-0 ${is_open ? 'z-50' : 'z-10'}`}>
                    <div className={` flex flex-col w-full max-w-md bg-gray-50 border rounded-lg shadow-md space-y-4 ltr:left-0 rtl:right-0 bottom-0 transform transition-transform duration-300 ${is_open ? "" : "translate-y-full"}`}>
                        <header className={`flex items-center justify-between px-4 py-3 rounded-t-lg border-b`}>
                            <h1 className={`font-roboto-semi-bold`}>Support</h1>
                            <button
                                onClick={toggleChat}
                                className={`hover:bg-main_bg p-2 rounded-full`}
                            >
                                <IoMdClose className={`size-5`}/>
                            </button>
                        </header>

                        {show_messages}



                         {/*Chat message from support*/}
                        <div className={`flex items-start space-x-2 p-4`}>
                            <img
                                src="./support-bot.png"
                                alt="Support Avatar"
                                className={`w-10 h-10 rounded-full`}
                            />
                            <div className={`bg-second_main_color text-white rounded-lg p-3`}>
                                <p className={`text-sm`}>
                                    Hello, Veronica! Thanks for getting in touch. How can I help you?
                                </p>
                            </div>
                        </div>

                        {/* Chat message from user */}
                        {/*<div className={`flex justify-end space-x-2`}>*/}
                        {/*    <div className={`bg-gray-100 text-gray-800 rounded-lg p-3`}>*/}
                        {/*        <p className={`text-sm`}>Hello, Ivy! I need your help. My payment doesn’t go through.</p>*/}
                        {/*    </div>*/}
                        {/*    <img*/}
                        {/*        src="https://via.placeholder.com/40"*/}
                        {/*        alt="User Avatar"*/}
                        {/*        className={`w-10 h-10 rounded-full`}*/}
                        {/*    />*/}
                        {/*</div>*/}

                        {/* Chat input for the user */}
                        <div className={`px-4 py-3 border-t bg-gray-50`}>
                            <form
                                className={`flex items-center space-x-2`}
                                onSubmit={handleSubmit}
                            >
                                <textarea
                                    value={input_message}
                                    onChange={handleChangeMessage}
                                    id="chatTextarea"
                                    placeholder="Type your message..."
                                    className={`flex-grow px-4 py-2 max-h-32 overflow-y-auto border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-second_main_color ${show_scrollbar ? 'show-scrollbar' : 'hide-scrollbar'}`}
                                    rows={1}
                                    onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                        const textarea = e.target;
                                        textarea.style.height = "auto"; // Reset height
                                        textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to content
                                        // Update scrollbar state based on height
                                        const height = parseInt(textarea.style.height.replace("px", ""), 10);
                                        setShow_scrollbar(height > 112); // Show scrollbar only if height >= 64px
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault(); // Prevent newline in textarea
                                            handleSubmit(e as unknown as FormEvent);
                                        }
                                    }}
                                />
                                <button
                                    // onClick={sendMessage}
                                    type={`submit`}
                                    className={`p-2 rounded-lg bg-second_main_color text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-second_main_color`}
                                >
                                    <IoMdSend />
                                </button>
                            </form>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}
