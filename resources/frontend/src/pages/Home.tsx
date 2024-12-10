import Image from "next/image";
import {FaSearch} from "react-icons/fa";
import HeroSectionBtn from "@/components/home/Hero-Section-Btn";
import MainHeader from "@/components/home/Main-Header";
import BookCard from "@/components/home/Book-Card";
import Link from "next/link";
import CategorySample from "@/components/home/Category-Sample";
import AuthorSample from "@/components/home/Author-Sample";
import ClientSearchInput from "@/components/home/Client-Search-Input";

export default function Home() {

    return (
        <>
            <div className="h-[400px] overflow-y-hidden relative flex flex-col items-center justify-center lg:mt-0">
                <Image
                    src={`home/hero-section-bg.svg`}
                    alt={`hero-section-bg`}
                    width={1440}
                    height={560}
                    priority={true}
                    placeholder={"blur"}
                    blurDataURL={`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpzdmdqcz0iaHR0cDovL3N2Z2pzLmNvbS9zdmdqcyIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1NjAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHZpZXdCb3g9IjAgMCAxNDQwIDU2MCI+PGcgbWFzaz0idXJsKCZxdW90OyNTdmdqc01hc2sxMDYzJnF1b3Q7KSIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjE0NDAiIGhlaWdodD0iNTYwIiB4PSIwIiB5PSIwIiBmaWxsPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY0KSIvPjxwYXRoIGQ9Ik0xNDM2IDEzMkwxNzQ2IC0xNzgiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NSkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IkJvdHRvbUxlZnQiLz48cGF0aCBkPSJNNTAwIDI3N0wxNjEgNjE2IiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NSkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IkJvdHRvbUxlZnQiLz48cGF0aCBkPSJNNTQgMzY2TC0xNzIgNTkyIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NSkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IkJvdHRvbUxlZnQiLz48cGF0aCBkPSJNMTM2MiAyNzJMMTExOCA1MTYiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY2KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iVG9wUmlnaHQiLz48cGF0aCBkPSJNMTM4MCAyMTdMMTYxOCAtMjEiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY1KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iQm90dG9tTGVmdCIvPjxwYXRoIGQ9Ik04MjIgNTA5TDQ5MSA4NDAiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY2KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iVG9wUmlnaHQiLz48cGF0aCBkPSJNNDc5IDM1TDY3MCAtMTU2IiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NSkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IkJvdHRvbUxlZnQiLz48cGF0aCBkPSJNNDQ1IDIxOEw1OTEgNzIiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY2KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iVG9wUmlnaHQiLz48cGF0aCBkPSJNMTMyNiA1MTRMMTcxOSAxMjEiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY1KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iQm90dG9tTGVmdCIvPjxwYXRoIGQ9Ik0xMDk4IDU1MEwxMzczIDI3NSIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2U9InVybCgjU3ZnanNMaW5lYXJHcmFkaWVudDEwNjUpIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJCb3R0b21MZWZ0Ii8+PHBhdGggZD0iTTQ4OSAyOTZMMjU4IDUyNyIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY2KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iVG9wUmlnaHQiLz48cGF0aCBkPSJNMzc5IDYyTC0xMCA0NTEiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY1KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iQm90dG9tTGVmdCIvPjxwYXRoIGQ9Ik0xMTMzIDY5TDk4MyAyMTkiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY2KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iVG9wUmlnaHQiLz48cGF0aCBkPSJNNjU1IDE1MkwxMDcxIC0yNjQiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NikiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IlRvcFJpZ2h0Ii8+PHBhdGggZD0iTTQ4MSA1NjBMNjM0IDQwNyIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY1KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iQm90dG9tTGVmdCIvPjxwYXRoIGQ9Ik02NzkgMjVMMjc4IDQyNiIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY2KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iVG9wUmlnaHQiLz48cGF0aCBkPSJNMzczIDI4MUwyMDMgNDUxIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NikiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IlRvcFJpZ2h0Ii8+PHBhdGggZD0iTTg5NCA1MTFMNzE1IDY5MCIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY2KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iVG9wUmlnaHQiLz48cGF0aCBkPSJNMzIxIDE3M0w2MzYgLTE0MiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2U9InVybCgjU3ZnanNMaW5lYXJHcmFkaWVudDEwNjUpIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJCb3R0b21MZWZ0Ii8+PHBhdGggZD0iTTg2NSAzMUw1NDkgMzQ3IiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2U9InVybCgjU3ZnanNMaW5lYXJHcmFkaWVudDEwNjYpIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJUb3BSaWdodCIvPjxwYXRoIGQ9Ik04NzAgNDc4TDEwMTYgMzMyIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NikiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IlRvcFJpZ2h0Ii8+PHBhdGggZD0iTTg5NyAyMjlMNjA3IDUxOSIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2U9InVybCgjU3ZnanNMaW5lYXJHcmFkaWVudDEwNjYpIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJUb3BSaWdodCIvPjxwYXRoIGQ9Ik0xMjAzIDMxOEwxNDUxIDcwIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NikiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IlRvcFJpZ2h0Ii8+PHBhdGggZD0iTTEyOTQgNDc5TDE2MzUgMTM4IiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2U9InVybCgjU3ZnanNMaW5lYXJHcmFkaWVudDEwNjYpIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJUb3BSaWdodCIvPjxwYXRoIGQ9Ik0yMTIgMjUwTC0xMTggNTgwIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NSkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IkJvdHRvbUxlZnQiLz48cGF0aCBkPSJNMjI5IDU3TC00MyAzMjkiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY2KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iVG9wUmlnaHQiLz48cGF0aCBkPSJNMTAyIDM0NEwtMzEwIDc1NiIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY2KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iVG9wUmlnaHQiLz48cGF0aCBkPSJNMTQyMiAxNDFMMTY3NSAtMTEyIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NikiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IlRvcFJpZ2h0Ii8+PHBhdGggZD0iTTc2MyA0MDlMMTA4OCA4NCIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY2KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iVG9wUmlnaHQiLz48cGF0aCBkPSJNMTAwMCAxOTBMNjY2IDUyNCIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY1KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iQm90dG9tTGVmdCIvPjxwYXRoIGQ9Ik00ODAgMTE5TDg3NiAtMjc3IiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NSkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IkJvdHRvbUxlZnQiLz48cGF0aCBkPSJNNTMxIDE0NEwzNjYgMzA5IiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZT0idXJsKCNTdmdqc0xpbmVhckdyYWRpZW50MTA2NikiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY2xhc3M9IlRvcFJpZ2h0Ii8+PHBhdGggZD0iTTc5OCAzNTZMNDgzIDY3MSIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2U9InVybCgjU3ZnanNMaW5lYXJHcmFkaWVudDEwNjUpIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJCb3R0b21MZWZ0Ii8+PHBhdGggZD0iTTEzMDYgMjQwTDE2NzMgLTEyNyIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2U9InVybCgjU3ZnanNMaW5lYXJHcmFkaWVudDEwNjUpIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJCb3R0b21MZWZ0Ii8+PHBhdGggZD0iTTc1NiAzNThMNDg5IDYyNSIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY2KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iVG9wUmlnaHQiLz48cGF0aCBkPSJNMjE5IDE4M0wtMTEwIDUxMiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2U9InVybCgjU3ZnanNMaW5lYXJHcmFkaWVudDEwNjUpIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJCb3R0b21MZWZ0Ii8+PHBhdGggZD0iTTExODEgMjE3TDEzOTcgMSIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2U9InVybCgjU3ZnanNMaW5lYXJHcmFkaWVudDEwNjUpIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJCb3R0b21MZWZ0Ii8+PHBhdGggZD0iTTI5NCA1NDZMLTQ1IDg4NSIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY1KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iQm90dG9tTGVmdCIvPjxwYXRoIGQ9Ik01MTMgNTU2TDI4NSA3ODQiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlPSJ1cmwoI1N2Z2pzTGluZWFyR3JhZGllbnQxMDY1KSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjbGFzcz0iQm90dG9tTGVmdCIvPjwvZz48ZGVmcz48bWFzayBpZD0iU3ZnanNNYXNrMTA2MyI+PHJlY3Qgd2lkdGg9IjE0NDAiIGhlaWdodD0iNTYwIiBmaWxsPSIjZmZmZmZmIi8+PC9tYXNrPjxsaW5lYXJHcmFkaWVudCB4MT0iMTAwJSIgeTE9IjUwJSIgeDI9IjAlIiB5Mj0iNTAlIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9IlN2Z2pzTGluZWFyR3JhZGllbnQxMDY0Ij48c3RvcCBzdG9wLWNvbG9yPSJyZ2JhKDAsIDE2NiwgMTYwLCAxKSIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0icmdiYSg2OSwgMTc2LCAxNTgsIDEpIiBvZmZzZXQ9IjAuOTkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMTAwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIiBpZD0iU3ZnanNMaW5lYXJHcmFkaWVudDEwNjUiPjxzdG9wIHN0b3AtY29sb3I9InJnYmEoNjksIDE3NiwgMTU4LCAwKSIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0icmdiYSg2OSwgMTc2LCAxNTgsIDEpIiBvZmZzZXQ9IjEiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMCUiIHkxPSIxMDAlIiB4Mj0iMTAwJSIgeTI9IjAlIiBpZD0iU3ZnanNMaW5lYXJHcmFkaWVudDEwNjYiPjxzdG9wIHN0b3AtY29sb3I9InJnYmEoNjksIDE3NiwgMTU4LCAwKSIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0icmdiYSg2OSwgMTc2LCAxNTgsIDEpIiBvZmZzZXQ9IjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=`}
                    className="object-cover h-full w-full absolute"
                />
                <div className={`z-10 flex flex-col items-center gap-y-4 text-white px-2 sm:px-0`}>
                    <h1 className="text-4xl font-roboto-bold">Noor Library</h1>
                    <form className={`relative w-full`}>
                        <ClientSearchInput/>
                    </form>

                    <div className={`flex flex-col items-center gap-y-8`}>
                        <div className={`flex flex-col max-[490px]:gap-y-3 min-[490px]:flex-row gap-x-4 min-[513px]:gap-x-7 mt-4`}>
                            <HeroSectionBtn content={`Trending Today`}/>
                            <HeroSectionBtn content={`Popular Books`}/>
                            <HeroSectionBtn content={`Latest Books`}/>
                        </div>
                        <Link href={`/add-book-to-store`}>
                            <HeroSectionBtn
                                content={`Upload Book`}
                                styles={`w-fit min-[490px]:ml-2 bg-white text-main_color font-roboto-semi-bold`}

                            />
                        </Link>
                    </div>

                </div>
            </div>

            <main className={`flex justify-center bg-main_bg py-8`}>
                <div className={`container  grid md:grid-cols-[5fr_2fr] lg:grid-cols-[5fr_1.6fr] gap-x-8`}>
                    <div className={`flex flex-col gap-y-4`}>
                        <MainHeader/>

                        <div className={`grid max-[500px]:grid-cols-2 grid-cols-3 lg:grid-cols-4 gap-4 px-2 sm:px-0`}>
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./home/hero-section-bg.svg"}
                                title={"title"}
                                author={"author"}
                            />
                        </div>
                    </div>
                    <aside className={`hidden font-roboto-semi-bold text-2xl text-text_color md:flex flex-col gap-y-8`}>
                        <div className={`flex flex-col gap-y-4 h-fit bg-white rounded p-4`}>
                            <div className={`flex items-center justify-between border-b pb-2 border-main_color`}>
                                <Link
                                    href={`#`}
                                    className={`hover:underline underline-offset-4`}
                                >
                                    Categories
                                </Link>
                                <FaSearch className={`size-5 cursor-pointer`}/>
                            </div>

                            <div className={`flex flex-col gap-y-4`}>
                                <CategorySample/>
                                <CategorySample/>
                                <CategorySample/>
                                <CategorySample/>
                                <CategorySample/>
                                <CategorySample/>
                                <CategorySample/>
                                <CategorySample/>
                                <CategorySample/>
                                <CategorySample/>
                                <CategorySample/>
                                <CategorySample/>
                                <CategorySample/>
                            </div>
                        </div>

                        <div className={`flex flex-col gap-y-4 h-fit bg-white rounded p-4`}>
                            <div className={`flex items-center justify-between border-b pb-2 border-main_color`}>
                                <Link
                                    href={`#`}
                                    className={`hover:underline underline-offset-4`}
                                >
                                    Authors
                                </Link>
                                <FaSearch className={`size-5 cursor-pointer`}/>
                            </div>

                            <div className={`flex flex-col gap-y-4`}>
                                <AuthorSample/>
                                <AuthorSample/>
                                <AuthorSample/>
                                <AuthorSample/>
                                <AuthorSample/>
                                <AuthorSample/>
                                <AuthorSample/>
                                <AuthorSample/>
                                <AuthorSample/>
                                <AuthorSample/>
                                <AuthorSample/>
                                <AuthorSample/>
                                <AuthorSample/>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
}
