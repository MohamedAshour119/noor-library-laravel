import {useEffect, useState} from 'react'
import {MdOutlineDarkMode, MdOutlineLightMode} from "react-icons/md";

export default function DarkMode() {

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedPreference = localStorage.getItem('theme');
        if (storedPreference) {
            return storedPreference === 'dark';
        }
        // Fallback: check system preference (optional)
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    return (
        <div className={`flex justify-self-end gap-x-2 items-center rounded-b border border-main_color dark:border-dark_second_color text-white px-3 py-[5px] bg-main_color dark:bg-dark_second_color hover:opacity-95 transition`}>
            <button
                onClick={toggleDarkMode}
                className="size-8 text-white dark:text-dark_text_color"
            >
                {isDarkMode &&
                    <div className={`size-full flex items-center justify-center rounded-lg`}>
                        <MdOutlineDarkMode className={`size-6`}/>
                    </div>
                }
                {!isDarkMode &&
                    <div className={`size-full flex items-center justify-center rounded-lg`}>
                        <MdOutlineLightMode className={`size-6`}/>
                    </div>
                }
            </button>
        </div>
    )
}
