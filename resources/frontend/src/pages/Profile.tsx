import {FaCamera, FaStar} from "react-icons/fa";
import Sections from "../components/profile/Sections.tsx";
import NotFoundContainer from "../components/profile/Not-Found-Container.tsx";
import BookPlaceholder from "../components/profile/Book-Placeholder.tsx";
import Footer from "../components/Footer.tsx";

export default function Profile() {
    return (
        <>
            <div className={`flex flex-col items-center bg-main_bg pt-5 gap-y-7`}>
                <div className={`container w-full flex flex-col items-center bg-white border-t-[3px] border-main_color rounded-t-2xl gap-y-4`}>
                    <div className={`p-5 flex flex-col items-center`}>
                        <div className={`flex flex-col items-center gap-y-3`}>
                            <div className={`relative group cursor-pointer`}>
                                <img
                                    className={`border-2 rounded-full`}
                                    src={`/profile-default-img.svg`}
                                    alt={`profile-default-img`}
                                />
                                <div className={`bg-black/40 size-[150px] rounded-full flex justify-center items-center absolute top-0 invisible group-hover:visible`}>
                                    <FaCamera className={`size-12 text-white`}/>
                                </div>
                            </div>
                            <span className={`text-2xl font-roboto-semi-bold tracking-wide`}>Mohamed Ashour</span>
                        </div>

                        <div className={`flex max-[393px]:flex-col gap-4 mt-4`}>
                            <div className={`bg-main_bg flex flex-col items-center px-10 py-2 rounded-full`}>
                                Rating
                                <div className={`flex items-center gap-x-2`}>
                                    <div className={`flex text-[#E0E0E0]`}>
                                        <FaStar className={`-ml-[2px]`} />
                                        <FaStar className={`-ml-[2px]`} />
                                        <FaStar className={`-ml-[2px]`} />
                                        <FaStar className={`-ml-[2px]`} />
                                        <FaStar className={`-ml-[2px]`} />
                                    </div>
                                    <span>(0)</span>
                                </div>
                            </div>
                            <div className={`bg-main_bg flex flex-col items-center px-10 py-2 rounded-full`}>
                                Last online
                                <span className={`flex items-center gap-x-2 text-main_color`}>
                                2 Days ago
                            </span>
                            </div>
                        </div>
                    </div>

                    <Sections
                        books_count={books_count}
                    />
                </div>
                {!showPlaceholder &&
                    <div className={`container w-full`}>
                        {isActive.books && books_total_page.current === 0 &&
                            <NotFoundContainer
                                src={`/profile/books-not-found.svg`}
                                content={`There are no books published for "Mohamed Ashour" Till Now,`}
                            />
                        }
                        {isActive.books && books_total_page.current && books_total_page.current > 0 &&
                            // <div className={`grid grid-cols-6 gap-4`}>
                            <div className={`pb-4 flex flex-wrap gap-4 max-md:justify-center max-md:items-center`}>
                                {show_books}
                                {show_books}
                            </div>
                        }
                        {isActive.reviews &&
                            <NotFoundContainer
                                src={`/profile/review-not-found.svg`}
                                content={`There are no reviews on books for "Mohamed Ashour" Till Now.`}
                                is_review_section_active={true}
                                is_book_section_active={false}
                            />
                        }
                        {isActive.purchased_books &&
                            <NotFoundContainer
                                src={`/profile/purchased-books-not-found.svg`}
                                content={`There are no purchased books for "Mohamed Ashour" Till Now.`}
                                is_purchased_books_active={true}
                                is_book_section_active={false}
                            />
                        }
                    </div>
                }
                {showPlaceholder &&
                    <div className={`pb-4 container w-full justify-center items-center flex flex-wrap md:grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4`}>
                        <BookPlaceholder/>
                        <BookPlaceholder/>
                        <BookPlaceholder/>
                        <BookPlaceholder/>
                        <BookPlaceholder/>
                        <BookPlaceholder/>
                    </div>
                }
            </div>
            <Footer/>
        </>
    )
}
