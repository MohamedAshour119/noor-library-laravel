import {FaCamera, FaStar} from "react-icons/fa";
import Sections from "../components/profile/Sections.tsx";
import NotFoundContainer from "../components/profile/Not-Found-Container.tsx";
import BookPlaceholder from "../components/profile/Book-Placeholder.tsx";
import Footer from "../components/Footer.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {useEffect, useRef, useState} from "react";
import {Book} from "../../Interfaces.ts";
import apiClient from "../../ApiClient.ts";
import BookCard from "../components/Book-Card.tsx";
import {enqueueSnackbar} from "notistack";
import {Link, useNavigate, useParams} from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Profile() {

    const isActive = useSelector((state: RootState) => state.usersProfileIsActiveReducer);
    // const user = useSelector((state: RootState) => state.user)
    const location = useLocation();
    const { user } = useParams()
    const user_state = useSelector((state: RootState) => state.user)

    const [books, setBooks] = useState<Book[]>([]);
    const [books_next_page_url, setBooks_next_page_url] = useState('');
    const [is_fetching, setIs_fetching] = useState(false);
    const [is_loading, setIs_loading] = useState(true);
    const [books_count, setBooks_count] = useState(0);

    const navigate = useNavigate()

    const getBook = (page_url: string) => {
        setIs_fetching(true)
        apiClient().get(page_url)
            .then(res => {
                setBooks(prevState => [...prevState, ...res.data.data.books])
                setBooks_next_page_url(res.data.data.next_page_url)
                setIs_loading(false)
                setIs_fetching(false)
            })
            .catch(err => {
                navigate('/')
                enqueueSnackbar(err.response.data.message, {variant: "error"})
                setIs_loading(false)
                setIs_fetching(false)
            })
    }

    useEffect(() => {
        // getBook('get-user-books')
    }, []);

    const last_book_ref = useRef(null);
    const show_books = books.map((book, index) => (
            <BookCard
                key={index}
                rate={140}
                title={book.title}
                cover={book.cover}
                author={book.author}
                ref={last_book_ref}
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
            <div className={`flex flex-col items-center bg-main_bg py-5 gap-y-7`}>
                <div className={`container w-full flex flex-col items-center bg-white border-t-[3px] border-main_color rounded-t-2xl gap-y-4`}>
                    <div className={`p-5 flex flex-col items-center`}>
                        <div className={`flex flex-col items-center gap-y-3`}>
                            <div className={`relative group cursor-pointer`}>
                                <img
                                    className={`border-2 rounded-full`}
                                    src={`/profile-default-img.svg`}
                                    alt={`profile-default-img`}
                                    width={150}
                                />
                                <div className={`bg-black/40 size-[150px] rounded-full flex justify-center items-center absolute top-0 invisible group-hover:visible`}>
                                    <FaCamera className={`size-12 text-white`}/>
                                </div>
                            </div>
                            <span className={`text-2xl font-roboto-semi-bold tracking-wide`}>Mohamed Ashour</span>
                        </div>

                        <div className={`flex max-[393px]:flex-col gap-4 mt-4`}>
                            {user_state.is_vendor &&
                                <Link
                                    to={`/`}
                                    className={`bg-main_color text-white flex justify-center gap-x-2 items-center px-8 py-2 rounded-full`}
                                >
                                    Manage Books
                                    <img
                                        src="/profile/manage-books.svg"
                                        alt="manage books"
                                        width={30}
                                    />
                                </Link>
                            }
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
                {!is_loading &&
                    <div className={`container w-full`}>
                        {/*{isActive.books && books_total_page.current === 0 &&*/}
                        {isActive.personal_info &&
                            <></>
                        }
                        {isActive.wishlist &&
                            <NotFoundContainer
                                src={`/profile/review-not-found.svg`}
                                content={`There are no reviews on books for "Mohamed Ashour" Till Now.`}
                                is_review_section_active={true}
                                is_book_section_active={false}
                            />
                        }
                        {isActive.order_history &&
                            <NotFoundContainer
                                src={`/profile/purchased-books-not-found.svg`}
                                content={`There are no purchased books for "Mohamed Ashour" Till Now.`}
                                is_purchased_books_active={true}
                                is_book_section_active={false}
                            />
                        }
                    </div>
                }
                {is_loading &&
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
