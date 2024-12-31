import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store.ts";
import { setIsAddToCartSidebarOpenSlice } from "../../redux/is_add_to_card_sidebar_open.ts";
import {IoMdClose} from "react-icons/io";

export default function AddToCartSidebar() {
    const isAddToCartSidebarSlice = useSelector(
        (state: RootState) => state.isAddToCartSidebarReducer.is_open
    );
    const dispatch = useDispatch();

    const closeSidebar = () => {
        dispatch(setIsAddToCartSidebarOpenSlice(false));
    };

    return (
        <>
            {/* Backdrop */}
            {isAddToCartSidebarSlice && (
                <div
                    className="left-0 top-0 w-screen h-screen fixed z-20 bg-black/70"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 h-full w-[20rem] bg-white shadow-[5px_5px_9px_black] border-text_color z-20 transform transition-transform duration-300 ${
                    isAddToCartSidebarSlice ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-lg font-semibold">Your Cart</h2>
                    <button
                        className="font-bold text-xl hover:bg-main_bg p-2 rounded-full"
                        onClick={closeSidebar}
                    >
                        <IoMdClose />
                    </button>
                </div>
                <ul className="p-4 space-y-2">
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ul>
            </div>
        </>
    );
}
