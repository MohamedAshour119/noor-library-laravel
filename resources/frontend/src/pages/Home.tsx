import ClientSearchInput from "../components/home/Client-Search-Input.tsx";
import HeroSectionBtn from "../components/home/Hero-Section-Btn.tsx";
import {Link} from "react-router-dom";
import MainHeader from "../components/home/Main-Header.tsx";
import BookCard from "../components/BookCard.tsx";
import {useEffect, useRef, useState} from "react";
// import {Modal} from "flowbite-react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import CategorySidebar from "../components/CategorySidebar.tsx";
import {BookCardInterface} from "../../Interfaces.ts";
import apiClient from "../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import BookPlaceholder from "../components/BookPlaceholder.tsx";
import {setUser} from "../../redux/user-slice.ts";
import {Modal} from "../components/Modal.tsx";
import {setIsUnauthorizedMessageOpenSlice} from "../../redux/is_unauthorized_message_open.ts";

type IsActive = {
    highest_rated: boolean
    popular_books: boolean
    latest_books: boolean
}
export default function Home() {
    const user = useSelector((state: RootState) => state.user)
    const translation = useSelector((state: RootState) => state.translationReducer)
    const auth_user = useSelector((state: RootState) => state.user)
    const isUnauthorizedMessageOpenSlice = useSelector((state: RootState) => state.isUnauthorizedMessageOpenReducer.is_open)

    const dispatch = useDispatch()

    const [books, setBooks] = useState<BookCardInterface[]>([]);
    const [books_next_page_url, setBooks_next_page_url] = useState('');
    const [is_loading, setIs_loading] = useState(true);
    const [is_fetching, setIs_fetching] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isActive, setIsActive] = useState<IsActive>({
        highest_rated: true,
        popular_books: false,
        latest_books: false
    });

    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (encodedData) {
        try {
            // Decode the data
            const decodedData = JSON.parse(atob(encodedData));

            // Use the decoded data
            localStorage.setItem('token', decodedData.token)
            localStorage.setItem('expires_at', decodedData.expires_at)
            dispatch(setUser(decodedData.data))

        } catch (error) {
            console.error('Error decoding data:', error);
        }
    }

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

    const last_book_ref = useRef<HTMLAnchorElement>(null);
    const show_books = books.map((book, index) => (
            <BookCard
                key={index}
                {...book}
                ref={index === books.length - 1 ? last_book_ref : null}
            />
        )
    )

    useEffect(() => {
        if (!last_book_ref.current) return;  // Exit if the ref is null

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !is_fetching && books_next_page_url) {
                getSectionBooks(books_next_page_url);
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

    const getSectionBooks = (page_url: string, is_fetch_at_start = false) => {
        if (is_fetch_at_start) {
            setIs_loading(true)
        }
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
                setIs_loading(false)
            })
    }

    useEffect(() => {
        setBooks([])
        if (is_loading) {
            getSectionBooks('/home/books/highest_rated', true)
        } else {
            if (isActive.highest_rated) {
                getSectionBooks('/home/books/highest_rated', true)
            }else if (isActive.popular_books) {
                getSectionBooks('/home/books/popular_books', true)
            }else {
                getSectionBooks('/home/books/latest_books', true)
            }
        }
    }, [isActive]);


    const modal_ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!modal_ref.current?.contains(e.target as Node)) {
                dispatch(setIsUnauthorizedMessageOpenSlice(false))
            }
        }

        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    return (
        <>
            <div className="dark:bg-dark_second_color max-[527px]:h-[500px] min:[528px]:h-[400px] relative flex flex-col items-center justify-center lg:mt-0 py-20">
                {isFocused && <div className={`left-0 top-0 w-screen h-screen fixed z-20 bg-black/70 `}></div>}
                {(auth_user.is_vendor || auth_user.is_vendor === null) &&
                    <Modal
                        isOpen={isUnauthorizedMessageOpenSlice}
                        onClose={() => dispatch(setIsUnauthorizedMessageOpenSlice(false))}
                        header={translation.unauthorized}
                        ref={modal_ref}
                    >
                        <main className={`p-4 text-gray-500 dark:text-dark_text_color`}>
                            {auth_user.is_vendor ? translation.unauthorized_vendor_message : !auth_user.is_vendor ? translation.must_sign_in : ''}
                        </main>

                    </Modal>
                }
                {!user.is_vendor &&
                    <Modal
                        isOpen={isFocused}
                        onClose={handleClose}
                        header={translation.unauthorized}
                        ref={modalRef}
                    >
                        <main className={`p-4 text-gray-500 dark:text-dark_text_color`}>
                            {auth_user.id && !auth_user.is_vendor ? translation.unauthorized_customer_message : translation.must_sign_in}
                        </main>

                    </Modal>
                }
                <img
                    src={`./home/hero-section-bg.svg`}
                    alt={`hero-section-bg`}
                    className="object-cover h-full w-full absolute dark:hidden"
                />
                <div className={`z-10 flex flex-col items-center gap-y-4 text-white dark:text-dark_text_color px-2 sm:px-0`}>
                    <h1 className="text-4xl font-roboto-bold">{translation.title}</h1>
                    <form className={`relative w-full`}>
                        <ClientSearchInput/>
                    </form>

                    <div className={`flex flex-col items-center`}>
                        {!user.is_vendor &&
                            <button onClick={handleOpen}>
                                <HeroSectionBtn
                                    content={translation.upload_book}
                                    styles={`w-fit min-[490px]:ml-2 mt-4 bg-white dark:bg-dark_main_color dark:border-dark_main_color text-main_color dark:text-dark_text_color font-roboto-semi-bold`}
                                />
                            </button>
                        }

                        {user.is_vendor &&
                            <Link to={`/add-book`}>
                                <HeroSectionBtn
                                    content={translation.upload_book}
                                    styles={`w-fit min-[490px]:ml-2 mt-4 bg-white text-main_color font-roboto-semi-bold`}
                                />
                            </Link>
                        }
                    </div>

                </div>
            </div>

            <main className={`flex justify-center bg-main_bg dark:bg-dark_main_color py-8 relative`}>
                <div className={`container grid md:grid-cols-[5fr_2fr] lg:grid-cols-[5fr_1.6fr] gap-x-8`}>
                    <div className={`flex flex-col gap-y-4`}>
                        <MainHeader
                            isActive={isActive}
                            setIsActive={setIsActive}
                        />

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
                    </aside>
                </div>
            </main>
        </>
    );
}
