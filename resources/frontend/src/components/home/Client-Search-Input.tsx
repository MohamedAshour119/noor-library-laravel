import {useEffect, useState} from 'react'
import {FaSearch} from "react-icons/fa";

export default function ClientSearchInput() {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true)
    }
    const handleBlur = () => {
        setIsFocused(false)
    }

    const body_el = document.body;

    useEffect(() => {
        if (isFocused) {
            body_el.classList.add('search-input-active');
        } else {
            body_el.classList.remove('search-input-active');
        }
    }, [isFocused]);

    return (
        <>
            {/* Background when search input is active */}
            {isFocused && <div className={`left-0 top-0 w-screen h-screen fixed z-20 bg-black/70 `}></div>}
            <FaSearch className={`size-6 text-main_color absolute -translate-y-1/2 top-1/2 left-4 z-40`}/>
            <input
                type="text"
                placeholder={`Search for Book, Author or Category`}
                className={`sm:w-[40rem] w-full max-[468px]:placeholder:text-sm py-4 ps-12 pe-32 rounded-full focus:outline-0 text-text_color text-lg font-roboto-medium relative z-30`}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <button className={`bg-main_color absolute right-[2px] top-[2px] py-4 px-8 rounded-full font-semibold z-30`}>Search</button>
        </>

    )
}
