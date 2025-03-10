import {Dispatch, SetStateAction} from 'react'
import MainHeaderBtn from "./Main-Header-Btn.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {useDarkMode} from "../../hooks/UseDarkMode.ts";

interface Props {
    isActive: IsActive
    setIsActive: Dispatch<SetStateAction<IsActive>>
}
type IsActive = {
    highest_rated: boolean
    popular_books: boolean
    latest_books: boolean
}
export default function MainHeader(props: Props) {
    const {isActive, setIsActive} = props
    const translation = useSelector((state: RootState) => state.translationReducer)

    const handleActiveChoice = (type: string) => {
        setIsActive({
            highest_rated: false,
            popular_books: false,
            latest_books: false,
            [type]: true
        })
    }

    const is_dark_mode = useDarkMode();

    const active_highest_rated_src = is_dark_mode ? '/home/dark-highest-rated-active.svg' : '/home/highest-rated-active.svg';
    const active_popular_books_src = is_dark_mode ? '/home/dark-popular-active.svg' : '/home/popular-active.svg';
    const active_latest_books_src = is_dark_mode ? '/home/dark-latest-active.svg' : '/home/latest-active.svg';

    return (
        <header className={`flex bg-white dark:bg-dark_second_color pt-6 border border-border_color dark:border-dark_border_color w-full flex-col gap-y-5 xs:gap-y-0 xs:flex-row items-center `}>
            <MainHeaderBtn
                onClick={() => handleActiveChoice('highest_rated')}
                styles={`${isActive.highest_rated ? '!border-main_color dark:!border-dark_border_color text-main_color dark:text-dark_text_color' : 'dark:!text-white'} w-full`}
                src={isActive.highest_rated ? active_highest_rated_src : '/home/highest-rated-not-active.svg'}
                content={translation.highest_rated}
            />

            <MainHeaderBtn
                onClick={() => handleActiveChoice('popular_books')}
                styles={`${isActive.popular_books ? '!border-main_color dark:!border-dark_border_color text-main_color dark:text-dark_text_color' : 'dark:!text-white'} w-full`}
                src={isActive.popular_books ? active_popular_books_src : '/home/popular-not-active.svg'}
                content={translation.popular_books}
            />

            <MainHeaderBtn
                onClick={() => handleActiveChoice('latest_books')}
                styles={`${isActive.latest_books ? '!border-main_color dark:!border-dark_border_color text-main_color dark:text-dark_text_color' : 'dark:!text-white'} w-full`}
                src={isActive.latest_books ? active_latest_books_src : '/home/latest-not-active.svg'}
                content={translation.latest_books}
            />
        </header>
    )
}
