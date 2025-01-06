import {FaCamera} from "react-icons/fa";
import Sections from "../components/profile/Sections.tsx";
import NotFoundContainer from "../components/profile/Not-Found-Container.tsx";
import BookPlaceholder from "../components/BookPlaceholder.tsx";
import Footer from "../components/Footer.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import {BookCardInterface, Errors, SignUpForm} from "../../Interfaces.ts";
import apiClient from "../../ApiClient.ts";
import BookCard from "../components/BookCard.tsx";
import {enqueueSnackbar} from "notistack";
import {Link, useNavigate, useParams} from "react-router-dom";
import TextInputAuth from "../components/core/TextInputAuth.tsx";
import {Button, Label, Modal, Spinner, TextInput} from "flowbite-react";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import {setUser} from "../../redux/user-slice.ts";
import {setUserProfileInfo} from "../../redux/user-profile-info-slice.ts";
import {setTempToken} from "../../redux/temp-token.ts";
export default function Profile() {
    const translation = useSelector((state: RootState) => state.translationReducer)
    const user_isActive = useSelector((state: RootState) => state.usersProfileIsActiveReducer);
    const vendor_isActive = useSelector((state: RootState) => state.vendorsProfileIsActiveReducer);
    const user_state = useSelector((state: RootState) => state.user)
    const user_info = useSelector((state: RootState) => state.userProfileInfoReducer)
    const is_visited_user_sections_active = useSelector((state: RootState) => state.isVisitedUserSectionsActive);
    const is_visited_vendor_sections_active = useSelector((state: RootState) => state.isVisitedVendorSectionsActive);
    const temp_token = useSelector((state: RootState) => state.tempTokenReducer)
    const { user } = useParams()
    const dispatch = useDispatch();

    const [books, setBooks] = useState<BookCardInterface[]>([]);
    const [is_fetching, setIs_fetching] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviews_next_page_url, setReviews_next_page_url] = useState('');
    const [wishlist_books, setWishlist_books] = useState<BookCardInterface[]>([]);
    const [wishlist_books_next_page_url, setWishlist_books_next_page_url] = useState('');
    const [wishlist_books_is_fetching, setWishlist_books_is_fetching] = useState(false);
    const [orders_history, setOrders_history] = useState([]);
    const [books_next_page_url, setBooks_next_page_url] = useState('');
    const [is_loading, setIs_loading] = useState(true);
    const [books_count, setBooks_count] = useState(0);
    const [formData, setFormData] = useState<SignUpForm>({
        first_name: user_state.first_name,
        last_name: user_state.last_name,
        phone_number: user_state.phone,
        country_code: user_state.country_code,
        email: user_state.email,
        password: '',
        password_confirmation: '',
    })
    const [errors, setErrors] = useState<Errors | null>(null)
    const [is_edit_active, setIs_edit_active] = useState(false);
    const [confirm_user_password, setConfirm_user_password] = useState('');
    const [is_confirm_password_open, setIs_confirm_password_open] = useState(false);
    const [is_confirm_user_password_input_focused, setIs_confirm_user_password_input_focused] = useState(false);
    const [is_loading_password_confirmation, setIs_loading_password_confirmation] = useState(false);
    const [error_password_confirmation, setError_password_confirmation] = useState(null);
    // const [temp_token, setTemp_token] = useState('');
    const [avatar, setAvatar] = useState<string | File | null>(null);
    const [show_save_avatar_btn, setShow_save_avatar_btn] = useState(false);

    const onFocus = () => {
        setIs_confirm_user_password_input_focused(true)
    }
    const onBlur = () => {
        setIs_confirm_user_password_input_focused(false)
    }

    const navigate = useNavigate()

    const handleIsEditActive = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIs_confirm_password_open(true);
    };


    const getBook = (page_url: string) => {
        setIs_fetching(true)
        apiClient().get(page_url)
            .then(res => {
                setBooks(prevState => [...prevState, ...res.data.data.books])
                setBooks_next_page_url(res.data.data.next_page_url)
            })
            .catch(err => {
                navigate('/')
                enqueueSnackbar(err.response.data.message, {variant: "error"})
            })
            .finally(() => {
                setIs_fetching(false)
            })
    }
    const getUserInfo = () => {
        setIs_loading(true)
        setIs_fetching(true)
        apiClient().get(`/users/${user}`)
            .then(res  => {
                if (res.data.data.user) {
                    dispatch(setUserProfileInfo(res.data.data.user))
                }else {
                    dispatch(setUserProfileInfo(res.data.data.vendor))
                    setBooks(res.data.data.books)
                    setBooks_next_page_url(res.data.data.next_page_url)
                    setBooks_count(res.data.data.books_count)
                }
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.errors)
            })
            .finally(() => {
                setIs_loading(false)
                setIs_fetching(false)
            })
    }

    const getWishlistBooks = (page_url: string, is_first_fetch = false) => {
        if (is_first_fetch) {
            setIs_loading(true)
        }
        setIs_fetching(true)
        apiClient().get(page_url)
            .then(res => {
                if(res.data.data.wishlist_books) {
                    setWishlist_books(prevState => [...prevState, ...res.data.data.wishlist_books])
                    setWishlist_books_next_page_url(res.data.data.wishlist_books_next_page_url)
                }
            })
            .catch(err => {
                if (err.response?.data?.errors) {
                    enqueueSnackbar(err.response.data.errors, {variant: "error"})
                }
            })
            .finally(() => {
                setIs_loading(false)
                setIs_fetching(false)
            })
    }

    useEffect(() => {
        if ((user_isActive.wishlist || is_visited_user_sections_active.wishlist) && wishlist_books.length === 0) {
            getWishlistBooks(`/wishlist/${user_info.id}`, true)
        }
    }, [user_isActive, is_visited_user_sections_active.wishlist]);


    const last_book_ref = useRef(null);
    const show_books = books.map((book, index) => (
            <BookCard
                key={index}
                title={book.title}
                cover={book.cover}
                slug={book.slug}
                author={book.author}
                ref={index === books.length - 1 ? last_book_ref : null}
                price={book.price}
                average_ratings={book.average_ratings}
                ratings_count={book.ratings_count}
            />
        )
    )
    const last_wishlist_book_ref = useRef(null);
    const show_wishlist_books = wishlist_books.map((book, index) => (
            <BookCard
                key={index}
                title={book.title}
                cover={book.cover}
                slug={book.slug}
                author={book.author}
                ref={index === wishlist_books.length - 1 ? last_wishlist_book_ref : null}
                price={book.price}
                average_ratings={book.average_ratings}
                ratings_count={book.ratings_count}
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

    useEffect(() => {
        if (!last_wishlist_book_ref.current) return;  // Exit if the ref is null

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !is_fetching && wishlist_books_next_page_url) {
                getWishlistBooks(wishlist_books_next_page_url);
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
        observer.observe(last_wishlist_book_ref.current);

        // Cleanup
        return () => {
            if (last_wishlist_book_ref.current) {
                observer.unobserve(last_wishlist_book_ref.current);
            }
        };
    }, [wishlist_books_next_page_url, is_fetching]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        axios.put('/api/users/update-profile', formData, {
            headers: {
                "Authorization": `Bearer ${temp_token}`, // Include the token as a Bearer token
                "Content-Type": "application/json"
            }})
            .then(res => {
                setErrors({})
                enqueueSnackbar(res.data.message, {variant: "success"})
            })
            .catch(err => {
                setErrors(err.response.data.errors)
                if (err.status === 401) {
                    dispatch(setTempToken(''))
                }
            })
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target)
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }
    const handlePhoneChange = (phone: string, country: any) => {
        setFormData({
            ...formData,
            phone_number: phone, // The full phone number with country code
            country_code: country.dialCode, // The country code only
        });
    };
    const handleConfirmUserPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirm_user_password(e.target.value)
    }

    const handleCloseModal = () => {
        setError_password_confirmation(null)
        setIs_confirm_password_open(false)
        setConfirm_user_password('')
    }


    const modal_ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!modal_ref.current?.contains(e.target as Node)) {
                setError_password_confirmation(null)
                setIs_confirm_password_open(false)
                setConfirm_user_password('')
            }
        }

        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    const submitConfirmPassword = () => {
        setIs_loading_password_confirmation(true)

        apiClient().post('/verify-password', {confirm_user_password: confirm_user_password})
            .then(res => {
                setErrors({})
                setError_password_confirmation(null)
                dispatch(setTempToken(res.data.data.token))
                enqueueSnackbar(res.data.message, {variant: "success"})
                setIs_confirm_password_open(false)
                setIs_edit_active(true)
            })
            .catch(err => {
                setError_password_confirmation(err.response.data.message)
            })
            .finally(() => setIs_loading_password_confirmation(false))
    }
    const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files[0].type.startsWith('image') && files.length > 0) {
            setAvatar(files[0])
            setShow_save_avatar_btn(true)
        }
    };

    const handleSaveAvatar = () => {
        console.log('Avatar file:', avatar);
        const formData = new FormData();
        formData.append('avatar', avatar as Blob);

        axios.post('/api/users/update-profile-avatar', formData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'multipart/form-data',
            }
        })
            .then(res => {
                dispatch(setUser({
                    ...user_state,
                    avatar: res.data.data.avatar
                }));
                setShow_save_avatar_btn(false)
            })
            .catch(err => {
                enqueueSnackbar(err.response?.data?.errors || 'Something went wrong', { variant: "error" });
            });
    }

    useEffect(() => {
        getUserInfo()
    }, [user]);

    const display_name = user_info ? (user_info?.first_name[0]?.toUpperCase() + user_info.first_name.slice(1)) + ' ' + (user_info?.last_name[0]?.toUpperCase() + user_info.last_name.slice(1)) : ''


    return (
        <>
            {is_confirm_password_open && <div className={`left-0 top-0 w-screen h-screen fixed z-20 bg-black/70 `}></div>}
            <Modal
                show={is_confirm_password_open}
                size="sm"
                onClose={handleCloseModal}
                popup
                ref={modal_ref}
                className={`animate-fade-in !absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2`}
            >
                <Modal.Header className={`!bg-white rounded-t`}/>
                <Modal.Body className={`pt-0 !bg-white rounded-b`}>
                    <div className="space-y-4 pb-4">
                        <h3 className="text-xl font-roboto-semi-bold text-gray-900">{translation.confirm_who_you_are}</h3>
                        <div className={`relative`}>
                            <Label
                                htmlFor="confirm_user_password"
                                value={translation.current_password}
                                className={`absolute !text-black/40 text-md cursor-text ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 px-1 z-10 transition-all duration-200 ${confirm_user_password.length > 0 || is_confirm_user_password_input_focused ? '!text-sm !top-0 !text-text_color bg-white' : 'bg-transparent'}`}
                            />
                            <TextInput
                                id="confirm_user_password"
                                value={confirm_user_password}
                                onChange={handleConfirmUserPassword}
                                required
                                onFocus={onFocus}
                                onBlur={onBlur}
                                style={{
                                    borderColor: !error_password_confirmation ? "var(--border_color)" : "red",
                                    padding: "10px 15px",
                                    outlineColor: is_confirm_user_password_input_focused && !error_password_confirmation ? "var(--main_color)" : "red",
                                    color: "var(--text_color)",
                                    backgroundColor: "white"
                                }}
                                type={'password'}
                            />
                        </div>
                            {error_password_confirmation && <span className={`text-red-600`}>{error_password_confirmation}</span>}
                        <div className="w-full">
                            <Button
                                className={`bg-main_color px-2 text-white rounded font-roboto-semi-bold text-lg`}
                                onClick={submitConfirmPassword}
                            >
                                {is_loading_password_confirmation && <Spinner className="!text-white fill-zinc-400" />}
                                {!is_loading_password_confirmation && translation.confirm}
                            </Button>
                        </div>
                    </div>
                    <span className={`text-main_color_darker font-roboto-semi-bold`}>{translation.security_refresh_password}</span>

                </Modal.Body>
            </Modal>
            <div className={`flex flex-col items-center bg-main_bg py-5 gap-y-7`}>
                <div className={`container w-full flex flex-col items-center bg-white border-t-[3px] border-main_color rounded-t-2xl gap-y-4`}>
                    <div className={`p-5 flex flex-col items-center`}>
                        <div className={`flex flex-col items-center gap-y-3`}>
                            <div className={`relative`}>
                                {user_state.username === user &&
                                    <div className={`group cursor-pointer`}>
                                        <label
                                            htmlFor="avatar"
                                            className={`cursor-pointer`}
                                        >
                                            <img
                                                className={`object-cover size-[150px] rounded-full appearance-none leading-tight border bg-white cursor-pointer flex items-center gap-x-2`}
                                                src={user_info?.avatar && !avatar ? user_info?.avatar : avatar ? URL.createObjectURL(avatar as File) : `/profile-default-img.svg`}
                                                alt={`avatar`}
                                            />
                                            <div
                                                className={`bg-black/40 size-[150px] rounded-full flex justify-center items-center absolute top-0 invisible group-hover:visible`}>
                                                <FaCamera className={`size-12 text-white`}/>
                                            </div>
                                        </label>

                                        <input
                                            type="file"
                                            id={`avatar`}
                                            name={'avatar'}
                                            className="hidden"
                                            onChange={handleAvatarUpload}
                                        />
                                    </div>
                                }
                                {user_state.username !== user &&
                                    <img
                                        className={`object-cover size-[150px] rounded-full appearance-none leading-tight border bg-white flex items-center gap-x-2`}
                                        src={user_info?.avatar && !avatar ? user_info?.avatar : avatar ? URL.createObjectURL(avatar as File) : `/profile-default-img.svg`}
                                        alt={`avatar`}
                                    />
                                }
                                {show_save_avatar_btn &&
                                    <button
                                        className={`bg-main_color mt-2 py-1 text-white rounded font-roboto-semi-bold w-full text-lg`}
                                        onClick={handleSaveAvatar}
                                    >
                                        {translation.save}
                                    </button>
                                }
                            </div>
                            <span className={`text-2xl font-roboto-semi-bold tracking-wide text-center`}>
                                {display_name}
                            </span>
                        </div>

                        <div className={`flex max-[393px]:flex-col gap-4 mt-4`}>
                            {user_info?.is_vendor && user_state.is_vendor && user_state.username === user &&
                                <Link
                                    to={`/`}
                                    className={`bg-main_color text-white font-roboto-bold flex justify-center gap-x-2 items-center px-8 py-2 rounded-full`}
                                >
                                    {translation.manage_books}
                                    <img
                                        src="/profile/manage-books.svg"
                                        alt="manage books"
                                        width={30}
                                    />
                                </Link>
                            }
                            <div className={`bg-main_bg flex flex-col items-center px-10 py-2 rounded-full`}>
                                {translation.last_online}
                                <span className={`flex items-center gap-x-2 text-main_color`}>
                                    2 Days ago
                                </span>
                            </div>
                        </div>
                    </div>

                    <Sections
                        setErrors={setErrors}
                        books_count={books_count}
                    />
                </div>
                {!is_loading &&
                    <div className={`container w-full`}>
                        {/*{user_isActive.books && books_total_page.current === 0 &&*/}
                        {((user_isActive.personal_info && vendor_isActive.personal_info) && user_state.username === user) &&
                            <form className={`bg-white p-5 rounded-lg`}>
                                <div className={`flex flex-col gap-y-5`}>
                                    <TextInputAuth
                                        placeholder={!is_edit_active && formData.first_name?.length !== 0 ? '' : translation.first_name}
                                        id={`first_name_id`}
                                        name={`first_name`}
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        error={errors?.first_name}
                                        readonly={!is_edit_active}
                                        disable_label_animation={!is_edit_active}
                                        styles={`!text-[16px] ${!is_edit_active ? 'cursor-not-allowed' : ''}`}
                                    />
                                    <TextInputAuth
                                        placeholder={!is_edit_active && formData.last_name?.length !== 0 ? '' : translation.last_name}
                                        id={`last_name_id`}
                                        name={`last_name`}
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        error={errors?.last_name}
                                        readonly={!is_edit_active}
                                        disable_label_animation={!is_edit_active}
                                        styles={`!text-[16px] ${!is_edit_active ? 'cursor-not-allowed' : ''}`}
                                    />

                                    <TextInputAuth
                                        placeholder={!is_edit_active && formData.email?.length !== 0 ? '' : translation.email}
                                        id={`email_id`}
                                        name={`email`}
                                        type={`email`}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={errors?.email}
                                        readonly={!is_edit_active}
                                        disable_label_animation={!is_edit_active}
                                        styles={`!text-[16px] ${!is_edit_active ? 'cursor-not-allowed' : ''}`}
                                    />
                                    <TextInputAuth
                                        placeholder={translation.new_password}
                                        id={`password_id`}
                                        type={`password`}
                                        name={`password`}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        error={errors?.password}
                                        readonly={!is_edit_active}
                                        disable_label_animation={!is_edit_active}
                                        styles={`!text-[16px] ${!is_edit_active ? 'cursor-not-allowed' : ''}`}
                                    />
                                    <TextInputAuth
                                        placeholder={translation.password_confirmation}
                                        id={`password_confirmation_id`}
                                        type={`password`}
                                        name={`password_confirmation`}
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        error={errors?.password_confirmation}
                                        readonly={!is_edit_active}
                                        disable_label_animation={!is_edit_active}
                                        styles={`!text-[16px] ${!is_edit_active ? 'cursor-not-allowed' : ''}`}
                                    />
                                    <PhoneInput
                                        country={'eg'}
                                        value={formData.phone_number}
                                        onChange={handlePhoneChange}
                                        enableSearch={true}
                                        disabled={!is_edit_active}
                                        placeholder={!is_edit_active ? user_state.phone : 'Enter Phone Number'}
                                        inputStyle={{
                                            width: '100%',
                                            height: '40px',
                                            borderRadius: '8px',
                                            border: `1px solid ${errors?.phone_number ? 'red' : 'var(--border_color)'}`,
                                            padding: document.dir === 'ltr' ? '10px 10px 10px 45px' : '10px 45px 10px 10px',
                                        }}
                                        containerStyle={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        buttonStyle={{
                                            border: `1px solid ${errors?.phone_number ? 'red' : 'var(--border_color)'}`,
                                        }}
                                    />
                                    {errors?.phone_number && <span className={`text-red-600 -mt-4`}>{errors.phone_number}</span>}

                                    <button
                                        onClick={is_edit_active ? handleSubmit : handleIsEditActive}
                                        className={`bg-main_color w-28 py-1 text-white rounded font-roboto-semi-bold text-lg`}
                                    >
                                        {!is_edit_active ? translation.edit : translation.save}
                                    </button>
                                </div>
                            </form>
                        }
                        {user_info?.is_vendor && user !== user_state.username && books.length === 0 && is_visited_vendor_sections_active.books &&
                            (
                                <NotFoundContainer
                                    src={`/profile/books-not-found.svg`}
                                    visited_user={display_name}
                                    content={translation.has_no_books_yet}
                                    content_style={`font-roboto-semi-bold`}
                                />
                            )
                        }
                        {user_info?.is_vendor && user !== user_state.username && books.length > 0 && is_visited_vendor_sections_active.books &&
                            (
                                <div className={`max-xxs:px-10 grid xxs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 !w-full`}>
                                    {show_books}
                                </div>
                            )
                        }
                        {user_info?.is_vendor && user !== user_state.username && reviews.length === 0 && is_visited_vendor_sections_active.reviews &&
                            <NotFoundContainer
                                src={`/profile/reviews-not-found.svg`}
                                visited_user={display_name}
                                content={translation.has_no_reviews}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user !== user_state.username && user_info.wishlists_count === 0 && is_visited_user_sections_active.wishlist &&
                            <NotFoundContainer
                                src={`/profile/wishlist-not-active.svg`}
                                visited_user={display_name}
                                content={translation.has_nothing_in_wishlist}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user !== user_state.username && reviews.length === 0 && is_visited_user_sections_active.reviews &&
                            <NotFoundContainer
                                src={`/profile/reviews-not-found.svg`}
                                visited_user={display_name}
                                content={translation.didnt_review_any_book}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user === user_state.username && user_info.wishlists_count === 0 && user_isActive.wishlist &&
                            <NotFoundContainer
                                src={`/profile/wishlist-not-active.svg`}
                                content={translation.you_have_nothing_in_wishlist}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user_info.wishlists_count !== undefined && user_info.wishlists_count > 0 && (user_isActive.wishlist || is_visited_user_sections_active.wishlist) &&
                            <div className={`max-xxs:px-10 grid xxs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 !w-full`}>
                                {show_wishlist_books}
                            </div>
                        }
                        {!user_info?.is_vendor && user === user_state.username && orders_history.length === 0 && user_isActive.order_history &&
                            <NotFoundContainer
                                src={`/profile/order-history-not-active.svg`}
                                content={translation.you_have_no_orders_yet}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {user_info?.is_vendor && user === user_state.username && reviews.length === 0 && vendor_isActive.reviews &&
                            <NotFoundContainer
                                src={`/profile/reviews-not-found.svg`}
                                content={translation.your_books_have_no_reviews}
                                content_style={`font-roboto-semi-bold`}
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
