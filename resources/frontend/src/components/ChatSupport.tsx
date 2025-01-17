import {IoChatbubbleEllipsesSharp} from "react-icons/io5";
import {useEffect, useRef, useState} from "react";
import {IoMdClose} from "react-icons/io";
import {useLocation} from "react-router-dom";

interface Props {

}
export default function ChatSupport(props: Props) {

    const [is_open, setIs_open] = useState(false);
    const [not_display_in_routes, setNot_display_in_routes] = useState(true);

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


    const openChat = () => {
        setIs_open(true)
    }
    const closeChat = () => {
        setIs_open(false)
    }

    const chatRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!chatRef.current?.contains(e.target as Node)) {
                setIs_open(false)
            }
        }

        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    return (
        <div className={`bg-main_color_darker flex justify-center z-50 relative`}>
            <div className={`container`}>
                {!is_open && not_display_in_routes &&
                    <IoChatbubbleEllipsesSharp
                        onClick={openChat}
                        className={`text-second_main_color hover:text-second_main_color/90 size-12 cursor-pointer fixed bottom-4 z-50`}
                    />
                }

                <div
                    className={`w-fit container fixed bottom-0 ${is_open ? 'visible' : 'invisible'}`}
                    ref={chatRef}
                >
                    <div className={` flex flex-col w-full max-w-md bg-gray-50 border rounded-lg shadow-md space-y-4 ltr:left-0 rtl:right-0 bottom-0 transform transition-transform duration-300 ${is_open ? "translate-x-0" : "translate-y-full"}`}>
                        <header className={`flex items-center justify-between px-4 py-3 rounded-t-lg border-b`}>
                            <h1 className={`font-roboto-semi-bold`}>Support</h1>
                            <button
                                onClick={closeChat}
                                className={`hover:bg-main_bg p-2 rounded-full`}
                            >
                                <IoMdClose className={`size-5`}/>
                            </button>
                        </header>
                        {/* Chat message from support */}
                        <div className={`flex items-start space-x-2 p-4`}>
                            <img
                                src="https://via.placeholder.com/40"
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
                        <div className={`flex justify-end space-x-2`}>
                            <div className={`bg-gray-100 text-gray-800 rounded-lg p-3`}>
                                <p className={`text-sm`}>Hello, Ivy! I need your help. My payment doesn’t go through.</p>
                            </div>
                            <img
                                src="https://via.placeholder.com/40"
                                alt="User Avatar"
                                className={`w-10 h-10 rounded-full`}
                            />
                        </div>

                        {/* Chat message from support */}
                        <div className={`flex items-start space-x-2 p-4`}>
                            <img
                                src="https://via.placeholder.com/40"
                                alt="Support Avatar"
                                className={`w-10 h-10 rounded-full`}
                            />
                            <div className={`bg-second_main_color text-white rounded-lg p-3`}>
                                <p className={`text-sm`}>
                                    What’s the error you’re getting while trying to make the payment?
                                </p>
                            </div>
                        </div>

                        {/* Chat message from user */}
                        <div className={`flex justify-end space-x-2`}>
                            <div className={`bg-gray-100 text-gray-800 rounded-lg p-3`}>
                                <p className={`text-sm`}>It asks me to enter a valid card number.</p>
                            </div>
                            <img
                                src="https://via.placeholder.com/40"
                                alt="User Avatar"
                                className={`w-10 h-10 rounded-full`}
                            />
                        </div>

                        {/* Chat message from support */}
                        <div className={`flex items-start space-x-2 p-4`}>
                            <img
                                src="https://via.placeholder.com/40"
                                alt="Support Avatar"
                                className={`w-10 h-10 rounded-full`}
                            />
                            <div className={`bg-second_main_color text-white rounded-lg p-3`}>
                                <p className={`text-sm`}>What card did you use?</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}
