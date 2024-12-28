import ClientSearchInput from "../components/home/Client-Search-Input.tsx";
import HeroSectionBtn from "../components/home/Hero-Section-Btn.tsx";
import {Link} from "react-router-dom";
import MainHeader from "../components/home/Main-Header.tsx";
import BookCard from "../components/BookCard.tsx";
import {useEffect, useRef, useState} from "react";
import {Modal} from "flowbite-react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import CategorySidebar from "../components/CategorySidebar.tsx";
import AuthorsSidebar from "../components/AuthorsSidebar.tsx";
import {BookCardInterface} from "../../Interfaces.ts";
import apiClient from "../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import BookPlaceholder from "../components/BookPlaceholder.tsx";

export default function Home() {
    const user = useSelector((state: RootState) => state.user)
    const [books, setBooks] = useState<BookCardInterface[]>([]);
    const [books_next_page_url, setBooks_next_page_url] = useState('');
    const [is_loading, setIs_loading] = useState(true);
    const [is_fetching, setIs_fetching] = useState(false);
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

    const getBook = (page_url: string, is_fetch_at_start = false) => {
        if (is_fetch_at_start) setIs_loading(false)
        setIs_fetching(true)
        apiClient().get(page_url)
            .then(res => {
                setBooks(prevState => [...prevState, ...res.data.data.books])
                setBooks_next_page_url(res.data.data.next_page_url)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.message, {variant: "error"})
            })
            .finally(() => {
                setIs_fetching(false)
            })
    }

    useEffect(() => {
        getBook('/home/get-books', true)
    }, []);


    const last_book_ref = useRef(null);
    const show_books = books.map((book, index) => (
            <BookCard
                key={index}
                average_ratings={book.average_ratings}
                ratings_count={book.ratings_count}
                title={book.title}
                cover={book.cover}
                is_free={book.is_free}
                slug={book.slug}
                author={book.author}
                price={book.price}
                ref={index === books.length - 1 ? last_book_ref : null}
            />
        )
    )

    useEffect(() => {
        if (!last_book_ref.current) return;  // Exit if the ref is null

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !is_fetching && books_next_page_url) {
                getBook(books_next_page_url);
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
        observer.observe(last_book_ref.current);

        // Cleanup
        return () => {
            if (last_book_ref.current) {
                observer.unobserve(last_book_ref.current);
            }
        };
    }, [books_next_page_url, is_fetching]);

    return (
        <>
            <div className="max-[527px]:h-[500px] min:[528px]:h-[400px] relative flex flex-col items-center justify-center lg:mt-0 py-20">
                {isFocused && <div className={`left-0 top-0 w-screen h-screen fixed z-20 bg-black/70 `}></div>}
                {!user.is_vendor &&
                    <Modal
                        show={isFocused}
                        onClose={handleClose}
                        className={`w-[40rem] !absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 animate-fade-in`}
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
                <div className={`container grid md:grid-cols-[5fr_2fr] lg:grid-cols-[5fr_1.6fr] gap-x-8`}>
                    <div className={`flex flex-col gap-y-4`}>
                        <MainHeader/>

                        <div className={`pb-4 container w-full justify-center items-center flex flex-wrap sm:grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`}>
                            {!is_loading && show_books}
                        </div>
                        {is_loading &&
                            <div className={`pb-4 container w-full justify-center items-center flex flex-wrap sm:grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`}>
                                {Array.from({length: 10}).map((_, index) => (
                                    <BookPlaceholder key={index}/>
                                ))}
                            </div>
                        }
                    </div>
                    <aside className={`hidden font-roboto-semi-bold text-2xl text-text_color md:flex flex-col gap-y-8`}>
                        <CategorySidebar/>
                        <AuthorsSidebar/>
                    </aside>
                </div>
            </main>
        </>
    );
}
