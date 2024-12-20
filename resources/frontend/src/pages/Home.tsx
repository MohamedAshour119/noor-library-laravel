import {FaSearch} from "react-icons/fa";
import ClientSearchInput from "../components/home/Client-Search-Input.tsx";
import HeroSectionBtn from "../components/home/Hero-Section-Btn.tsx";
import {Link} from "react-router-dom";
import MainHeader from "../components/home/Main-Header.tsx";
import BookCard from "../components/Book-Card.tsx";
import CategorySample from "../components/home/Category-Sample.tsx";
import AuthorSample from "../components/home/Author-Sample.tsx";
import {useEffect, useRef, useState} from "react";
import {Modal} from "flowbite-react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";

export default function Home() {
    const user = useSelector((state: RootState) => state.user)

    const [isFocused, setIsFocused] = useState(false);
    const body_el = document.body;
    const handleOpen = () => {
        setIsFocused(true)
    }
    const handleClose = () => {
        setIsFocused(false)
    }

    useEffect(() => {
        if (isFocused) {
            body_el.classList.add('search-input-active');
        } else {
            body_el.classList.remove('search-input-active');
        }
    }, [isFocused]);

    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!modalRef.current?.contains(e.target as Node)) {
                setIsFocused(false)
            }
        }

        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);


    return (
        <>
            <div className="max-[527px]:h-[500px] min:[528px]:h-[400px] relative flex flex-col items-center justify-center lg:mt-0 py-20">
                {isFocused && <div className={`left-0 top-0 w-screen h-screen fixed z-20 bg-black/70 `}></div>}
                {!user.is_vendor &&
                    <Modal
                        show={isFocused}
                        onClose={handleClose}
                        className={`w-[40rem] !absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 `}
                        ref={modalRef}
                    >
                        <Modal.Header className={`!border-b modal-header`}>
                            <h3 className="text-red-600 text-xl font-medium">Unauthorized!</h3>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="space-y-6">
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    {user.id ? `You are signed in as a customer,` : ''} You must sign in as a vendor.
                                </p>
                            </div>
                        </Modal.Body>
                        {/*<Modal.Footer>*/}
                        {/*    <Button onClick={handleClose}>I accept</Button>*/}
                        {/*    <Button color="gray" onClick={handleClose}>*/}
                        {/*        Decline*/}
                        {/*    </Button>*/}
                        {/*</Modal.Footer>*/}
                    </Modal>
                }
                <img
                    src={`./home/hero-section-bg.svg`}
                    alt={`hero-section-bg`}
                    className="object-cover h-full w-full absolute"
                />
                <div className={`z-10 flex flex-col items-center gap-y-4 text-white px-2 sm:px-0`}>
                    <h1 className="text-4xl font-roboto-bold">Noor Library</h1>
                    <form className={`relative w-full`}>
                        <ClientSearchInput/>
                    </form>

                    <div className={`flex flex-col items-center gap-y-8`}>
                        <div className={`flex flex-col min-503:flex-row gap-x-4 min-503:gap-x-4 gap-y-3 mt-4`}>
                            <HeroSectionBtn content={`Trending Today`}/>
                            <HeroSectionBtn content={`Popular Books`}/>
                            <HeroSectionBtn content={`Latest Books`}/>
                        </div>

                        {!user.is_vendor &&
                            <button onClick={handleOpen}>
                                <HeroSectionBtn
                                    content={`Upload Book`}
                                    styles={`w-fit min-[490px]:ml-2 bg-white text-main_color font-roboto-semi-bold`}
                                />
                            </button>
                        }

                        {user.is_vendor &&
                            <Link to={`/add-book`}>
                                <HeroSectionBtn
                                    content={`Upload Book`}
                                    styles={`w-fit min-[490px]:ml-2 bg-white text-main_color font-roboto-semi-bold`}
                                />
                            </Link>
                        }
                    </div>

                </div>
            </div>

            <main className={`flex justify-center bg-main_bg py-8`}>
                <div className={`container  grid md:grid-cols-[5fr_2fr] lg:grid-cols-[5fr_1.6fr] gap-x-8`}>
                    <div className={`flex flex-col gap-y-4`}>
                        <MainHeader/>

                        <div className={`pb-4 container w-full justify-center items-center flex flex-wrap sm:grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`}>
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
