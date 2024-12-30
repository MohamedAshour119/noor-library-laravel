import {useState} from 'react'
import MainHeaderBtn from "./Main-Header-Btn.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";

export default function MainHeader() {
    const translation = useSelector((state: RootState) => state.translationReducer)
    const [isActive, setIsActive] = useState({
        highest_rated: true,
        popular_books: false,
        latest_books: false
    });

    const handleActiveChoice = (type: string) => {
        setIsActive({
            highest_rated: false,
            popular_books: false,
            latest_books: false,
            [type]: true
        })
    }

    return (
        <header className={`flex bg-white pt-6 border border-border_color w-full max-[525px]:flex-col max-[525px]:gap-y-5 items-center `}>
            <MainHeaderBtn
                onClick={() => handleActiveChoice('highest_rated')}
                styles={isActive.highest_rated ? '!border-main_color text-main_color' : ''}
                src={isActive.highest_rated ? '/home/highest-rated-active.svg' : '/home/highest-rated-not-active.svg'}
                content={translation.highest_rated}
            />

            <MainHeaderBtn
                onClick={() => handleActiveChoice('popular_books')}
                styles={isActive.popular_books ? '!border-main_color text-main_color' : ''}
                src={isActive.popular_books ? '/home/popular-active.svg' : '/home/popular-not-active.svg'}
                content={translation.popular_books}
            />

            <MainHeaderBtn
                onClick={() => handleActiveChoice('latest_books')}
                styles={isActive.latest_books ? '!border-main_color text-main_color' : ''}
                src={isActive.latest_books ? '/home/latest-active.svg' : '/home/latest-not-active.svg'}
                content={translation.latest_books}
            />
        </header>
    )
}
