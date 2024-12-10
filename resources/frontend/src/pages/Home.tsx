import {FaSearch} from "react-icons/fa";
import ClientSearchInput from "../components/home/Client-Search-Input.tsx";
import HeroSectionBtn from "../components/home/Hero-Section-Btn.tsx";
import {Link} from "react-router-dom";
import MainHeader from "../components/home/Main-Header.tsx";
import BookCard from "../components/home/Book-Card.tsx";
import CategorySample from "../components/home/Category-Sample.tsx";
import AuthorSample from "../components/home/Author-Sample.tsx";
export default function Home() {

    return (
        <>
            <div className="h-[400px] overflow-y-hidden relative flex flex-col items-center justify-center lg:mt-0">
                <img
                    src={`home/hero-section-bg.svg`}
                    alt={`hero-section-bg`}
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
                        <Link to={`/add-book-to-store`}>
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

                        <div className={`grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-4 px-2 sm:px-0 justify-center`}>
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                            <BookCard
                                rate={140}
                                cover={"./download.jpg"}
                                title={"title"}
                                author={"author"}
                            />
                        </div>
                    </div>
                    <aside className={`hidden font-roboto-semi-bold text-2xl text-text_color md:flex flex-col gap-y-8`}>
                        <div className={`flex flex-col gap-y-4 h-fit bg-white rounded p-4`}>
                            <div className={`flex items-center justify-between border-b pb-2 border-main_color`}>
                                <Link
                                    to={`#`}
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
                                    to={`#`}
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
