import {useState} from 'react'
import MainHeaderBtn from "./Main-Header-Btn.tsx";

export default function MainHeader() {
    const [isActive, setIsActive] = useState({
        trending_today: true,
        popular_books: false,
        latest_books: false
    });

    const handleActiveChoice = (type: string) => {
        setIsActive({
            trending_today: false,
            popular_books: false,
            latest_books: false,
            [type]: true
        })
    }

    return (
        <header className={`flex bg-white pt-6 rounded border border-border_color w-full`}>
            <MainHeaderBtn
                onClick={() => handleActiveChoice(`trending_today`)}
                styles={isActive.trending_today ? '!border-main_color text-main_color' : ''}
                src={isActive.trending_today ? './home/trending-active.svg' : './home/trending-not-active.svg'}
                content={`Trending Today`}
            />
            <MainHeaderBtn
                onClick={() => handleActiveChoice(`popular_books`)}
                styles={isActive.popular_books ? '!border-main_color text-main_color' : ''}
                src={isActive.popular_books ? './home/popular-active.svg' : './home/popular-not-active.svg'}
                content={`Popular Books`}
            />
            <MainHeaderBtn
                onClick={() => handleActiveChoice(`latest_books`)}
                styles={isActive.latest_books ? '!border-main_color text-main_color' : ''}
                src={isActive.latest_books ? './home/latest-active.svg' : './home/latest-not-active.svg'}
                content={`Latest Books`}
            />
        </header>
    )
}
