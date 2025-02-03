import {FaCamera} from "react-icons/fa";
import Sections from "../components/profile/Sections.tsx";
import NotFoundContainer from "../components/profile/Not-Found-Container.tsx";
import BookPlaceholder from "../components/BookPlaceholder.tsx";
import Footer from "../components/Footer.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import {BookCardInterface, CommentInterface, Errors, SignUpForm} from "../../Interfaces.ts";
import apiClient from "../../ApiClient.ts";
import BookCard from "../components/BookCard.tsx";
import {enqueueSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
import TextInputAuth from "../components/core/TextInputAuth.tsx";
import {Button, Label, Spinner, TextInput} from "flowbite-react";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import {setUser} from "../../redux/user-slice.ts";
import {setUserProfileInfo} from "../../redux/user-profile-info-slice.ts";
import Reviews from "../components/profile/Reviews.tsx";
import {setResetVendorsActive} from "../../redux/vendors-profile-is-active-slice.ts";
import {Modal} from "../components/Modal.tsx";
import {useDarkMode} from "../hooks/UseDarkMode.ts";
export default function Profile() {
    const translation = useSelector((state: RootState) => state.translationReducer)
    const user_isActive = useSelector((state: RootState) => state.usersProfileIsActiveReducer);
    const vendor_isActive = useSelector((state: RootState) => state.vendorsProfileIsActiveReducer);
    const auth_user = useSelector((state: RootState) => state.user)
    const user_info = useSelector((state: RootState) => state.userProfileInfoReducer)
    const is_visited_user_sections_active = useSelector((state: RootState) => state.isVisitedUserSectionsActive);
    const is_visited_vendor_sections_active = useSelector((state: RootState) => state.isVisitedVendorSectionsActive);
    const { user } = useParams()
    const dispatch = useDispatch();

    const [temp_token, setTemp_token] = useState('');
    const [books, setBooks] = useState<BookCardInterface[]>([]);
    const [is_fetching, setIs_fetching] = useState(false);
    const [reviews, setReviews] = useState<CommentInterface[]>([]);
    const [reviews_next_page_url, setReviews_next_page_url] = useState('');
    const [reviews_is_loading, setReviews_is_loading] = useState(false);
    const [reviews_is_fetching, setReviews_is_fetching] = useState(false);
    const [reviews_count, setReviews_count] = useState(0);
    const [wishlist_books, setWishlist_books] = useState<BookCardInterface[]>([]);
    const [wishlist_books_next_page_url, setWishlist_books_next_page_url] = useState('');
    // const [wishlist_books_is_fetching, setWishlist_books_is_fetching] = useState(false);
    const [orders_history, setOrders_history] = useState([]);
    const [books_next_page_url, setBooks_next_page_url] = useState('');
    const [is_loading, setIs_loading] = useState(true);
    const [books_count, setBooks_count] = useState(0);
    const [formData, setFormData] = useState<SignUpForm>({
        first_name: auth_user.first_name,
        last_name: auth_user.last_name,
        phone_number: auth_user.phone,
        country_code: auth_user.country_code,
        email: auth_user.email,
        password: '',
        password_confirmation: '',
    })
    const [errors, setErrors] = useState<Errors | null>(null)
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
                setReviews(res.data.data.reviews)
                setReviews_next_page_url(res.data.data.reviews_next_page_url)
                if (res.data.data.reviews_count) {
                    setReviews_count(res.data.data.reviews_count)
                }
                if (res.data.data.user) {
                    dispatch(setUserProfileInfo(res.data.data.user))
                }else if (res.data.data.vendor.id !== auth_user.id) {
                    dispatch(setUserProfileInfo(res.data.data.vendor))
                    setBooks(res.data.data.books)
                    setBooks_next_page_url(res.data.data.next_page_url)
                    setBooks_count(res.data.data.books_count)
                }else {
                    dispatch(setUserProfileInfo(res.data.data.vendor))
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
        if ((user_isActive.wishlist || is_visited_user_sections_active.wishlist) && wishlist_books.length === 0 && !user_info.is_vendor && user_info.id) {
            getWishlistBooks(`/wishlist/${user_info.id}`, true)
        }
    }, [user_isActive, is_visited_user_sections_active, user_info.username]);


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
                ref={index === wishlist_books.length - 1 ? last_wishlist_book_ref : null}
                {...book}
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

    const filter_updated_formData = () => {
        const filtered_inputs = []

        if (formData.first_name === auth_user.first_name || formData.first_name === '') filtered_inputs.push('first_name')
        if (formData.last_name === auth_user.last_name || formData.last_name === '') filtered_inputs.push('last_name')
        if (formData.email === auth_user.email || formData.email === '') filtered_inputs.push('email')
        if (formData.country_code === auth_user.country_code || formData.country_code === '') filtered_inputs.push('country_code')
        if (formData.phone_number === auth_user.phone || formData.phone_number === '') filtered_inputs.push('phone_number')
        if (formData.password === '') filtered_inputs.push('password')
        if (formData.password_confirmation === '') filtered_inputs.push('password_confirmation')

        return filtered_inputs
    }
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        const filteredFields = filter_updated_formData();

        // Create a new object excluding the filtered fields
        const updatedFormData = Object.keys(formData)
            .filter((key) => !filteredFields.includes(key))
            .reduce((acc, key) => {
                // @ts-ignore
                acc[key] = formData[key as keyof typeof formData];
                return acc;
            }, {} as Partial<typeof formData>);

        axios.put('/api/users/update-profile', updatedFormData, {
            headers: {
                "Authorization": `Bearer ${temp_token}`,
                "Content-Type": "application/json"
            }})
            .then(res => {
                dispatch(setUser(res.data.data.user))
                setErrors({})
                enqueueSnackbar(res.data.message, {variant: "success"})
                setTemp_token('')
            })
            .catch(err => {
                setErrors(err.response.data.errors)
                console.log(err.response.status)
                if (err.response.status === 401) {
                    setTemp_token('')
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
                setTemp_token(res.data.data.token)
                enqueueSnackbar(res.data.message, {variant: "success"})
                setIs_confirm_password_open(false)
            })
            .catch(err => {
                if (err.response.data.message.length !== 0) {
                    setError_password_confirmation(err.response.data.message)
                }else {
                    setError_password_confirmation(err.response.data.errors)
                }
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
                    ...auth_user,
                    avatar: res.data.data.avatar
                }));
                setShow_save_avatar_btn(false)
            })
            .catch(err => {
                enqueueSnackbar(err.response?.data?.errors || 'Something went wrong', { variant: "error" });
            });
    }

    useEffect(() => {
        setReviews_count(0)
        dispatch(setResetVendorsActive())
        setWishlist_books([])
        getUserInfo()
    }, [user]);

    const display_name = user_info ? (user_info?.first_name[0]?.toUpperCase() + user_info.first_name.slice(1)) + ' ' + (user_info?.last_name[0]?.toUpperCase() + user_info.last_name.slice(1)) : ''
    const is_dark_mode = useDarkMode()

    return (
        <>
            {is_confirm_password_open && <div className={`left-0 top-0 w-screen h-screen fixed z-20 bg-black/70 `}></div>}
            <Modal
                isOpen={is_confirm_password_open}
                onClose={handleCloseModal}
                ref={modal_ref}
            >
                <main className={`px-4 text-gray-500`}>
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
                </main>

            </Modal>
            <div className={`flex flex-col items-center bg-main_bg dark:bg-dark_main_color py-5 gap-y-7`}>
                <div className={`container w-full flex flex-col items-center bg-white dark:bg-dark_second_color dark:border-dark_border_color dark:text-dark_text_color border-t-[3px] border-main_color rounded-t-2xl gap-y-4`}>
                    <div className={`p-5 flex flex-col items-center`}>
                        <div className={`flex flex-col items-center gap-y-3`}>
                            <div className={`relative`}>
                                {auth_user.username === user &&
                                    <div className={`group cursor-pointer`}>
                                        <label
                                            htmlFor="avatar"
                                            className={`cursor-pointer`}
                                        >
                                            <img
                                                className={`object-cover size-[150px] rounded-full appearance-none leading-tight border dark:border-dark_border_color bg-white cursor-pointer flex items-center gap-x-2`}
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
                                {auth_user.username !== user &&
                                    <img
                                        className={`object-cover size-[150px] rounded-full appearance-none leading-tight border bg-white flex items-center gap-x-2`}
                                        src={user_info?.avatar && !avatar ? user_info?.avatar : avatar ? URL.createObjectURL(avatar as File) : `/profile-default-img.svg`}
                                        alt={`avatar`}
                                    />
                                }
                                {show_save_avatar_btn &&
                                    <button
                                        className={`bg-main_color dark:bg-dark_main_color dark:border dark:border-dark_border_color mt-2 py-1 text-white rounded font-roboto-semi-bold w-full text-lg`}
                                        onClick={handleSaveAvatar}
                                    >
                                        {translation.save}
                                    </button>
                                }
                            </div>
                            <h1 className={`text-2xl font-roboto-semi-bold tracking-wide text-center`}>
                                {display_name}
                            </h1>
                        </div>

                        <div className={`flex max-[393px]:flex-col gap-4 mt-4`}>
                            {user_info?.is_vendor && auth_user.is_vendor && auth_user.username === user &&
                                <a
                                    href={`/vendor`}
                                    target={`_blanc`}
                                    className={`bg-main_color dark:bg-dark_main_color dark:border dark:border-dark_border_color text-white font-roboto-bold flex justify-center gap-x-2 items-center px-8 py-2 rounded-full`}
                                >
                                    {translation.manage_books}
                                    <img
                                        src="/profile/manage-books.svg"
                                        alt="manage books"
                                        width={30}
                                    />
                                </a>
                            }
                            <div className={`bg-main_bg dark:bg-dark_main_color/70 dark:border dark:border-dark_border_color flex flex-col items-center px-10 py-2 rounded-full`}>
                                {translation.last_online}
                                <span className={`flex items-center gap-x-2 text-main_color dark:text-dark_text_color/70`}>
                                    2 Days ago
                                </span>
                            </div>
                        </div>
                    </div>

                    <Sections
                        setErrors={setErrors}
                        books_count={books_count}
                        reviews_count={reviews_count}
                    />
                </div>
                {!is_loading &&
                    <div className={`container w-full`}>
                        {/*{user_isActive.books && books_total_page.current === 0 &&*/}
                        {((user_isActive.personal_info && vendor_isActive.personal_info) && auth_user.username === user) &&
                            <form className={`bg-white p-5 rounded-lg`}>
                                <div className={`flex flex-col gap-y-5`}>
                                    <TextInputAuth
                                        placeholder={!temp_token && formData.first_name?.length !== 0 ? '' : translation.first_name}
                                        id={`first_name_id`}
                                        name={`first_name`}
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        error={errors?.first_name}
                                        readonly={!temp_token}
                                        disable_label_animation={!temp_token}
                                        styles={`!text-[16px] ${!temp_token ? 'cursor-not-allowed' : ''}`}
                                    />
                                    <TextInputAuth
                                        placeholder={!temp_token && formData.last_name?.length !== 0 ? '' : translation.last_name}
                                        id={`last_name_id`}
                                        name={`last_name`}
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        error={errors?.last_name}
                                        readonly={!temp_token}
                                        disable_label_animation={!temp_token}
                                        styles={`!text-[16px] ${!temp_token ? 'cursor-not-allowed' : ''}`}
                                    />

                                    <TextInputAuth
                                        placeholder={!temp_token && formData.email?.length !== 0 ? '' : translation.email}
                                        id={`email_id`}
                                        name={`email`}
                                        type={`email`}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={errors?.email}
                                        readonly={!temp_token}
                                        disable_label_animation={!temp_token}
                                        styles={`!text-[16px] ${!temp_token ? 'cursor-not-allowed' : ''}`}
                                    />
                                    <TextInputAuth
                                        placeholder={translation.new_password}
                                        id={`password_id`}
                                        type={`password`}
                                        name={`password`}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        error={errors?.password}
                                        readonly={!temp_token}
                                        disable_label_animation={!temp_token}
                                        styles={`!text-[16px] ${!temp_token ? 'cursor-not-allowed' : ''}`}
                                    />
                                    <TextInputAuth
                                        placeholder={translation.password_confirmation}
                                        id={`password_confirmation_id`}
                                        type={`password`}
                                        name={`password_confirmation`}
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        error={errors?.password_confirmation}
                                        readonly={!temp_token}
                                        disable_label_animation={!temp_token}
                                        styles={`!text-[16px] ${!temp_token ? 'cursor-not-allowed' : ''}`}
                                    />
                                    <PhoneInput
                                        country={'eg'}
                                        value={formData.phone_number}
                                        onChange={handlePhoneChange}
                                        enableSearch={true}
                                        disabled={!temp_token}
                                        placeholder={!temp_token ? auth_user.phone : 'Enter Phone Number'}
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
                                        onClick={temp_token.length !== 0 ? handleSubmit : handleIsEditActive}
                                        className={`bg-main_color w-28 py-1 text-white rounded font-roboto-semi-bold text-lg`}
                                    >
                                        {temp_token.length === 0 ? translation.edit : translation.save}
                                    </button>
                                </div>
                            </form>
                        }
                        {user_info?.is_vendor && user !== auth_user.username && books.length === 0 && is_visited_vendor_sections_active.books &&
                            (
                                <NotFoundContainer
                                    src={`/profile/books-not-found.svg`}
                                    visited_user={display_name}
                                    content={translation.has_no_books_yet}
                                    content_style={`font-roboto-semi-bold`}
                                />
                            )
                        }
                        {user_info?.is_vendor && user !== auth_user.username && books.length > 0 && is_visited_vendor_sections_active.books &&
                            (
                                <div className={`max-xxs:px-10 grid xxs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 !w-full`}>
                                    {show_books}
                                </div>
                            )
                        }
                        {user_info?.is_vendor && user !== auth_user.username && reviews_count === 0 && is_visited_vendor_sections_active.reviews &&
                            <NotFoundContainer
                                src={is_dark_mode ? '/profile/dark-reviews-active.svg' : `/profile/reviews-not-found.svg`}
                                visited_user={display_name}
                                content={translation.has_no_reviews}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user !== auth_user.username && user_info.wishlists_count === 0 && is_visited_user_sections_active.wishlist &&
                            <NotFoundContainer
                                src={is_dark_mode ? '/profile/dark-wishlist-active.svg' : `/profile/wishlist-not-active.svg`}
                                visited_user={display_name}
                                content={translation.has_nothing_in_wishlist}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user !== auth_user.username && reviews_count === 0 && is_visited_user_sections_active.reviews &&
                            <NotFoundContainer
                                src={`/profile/reviews-not-found.svg`}
                                visited_user={display_name}
                                content={translation.didnt_review_any_book}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user === auth_user.username && user_info.wishlists_count === 0 && user_isActive.wishlist &&
                            <NotFoundContainer
                                src={is_dark_mode ? '/profile/dark-wishlist-active.svg' : `/profile/wishlist-not-active.svg`}
                                content={translation.you_have_nothing_in_wishlist}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user_info.wishlists_count !== undefined && user_info.wishlists_count !== null && user_info.wishlists_count > 0 && ((user_isActive.wishlist && user_info.username === auth_user.username) || (is_visited_user_sections_active.wishlist && user_info.username !== auth_user.username)) &&
                            <div className={`max-xxs:px-10 grid xxs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 !w-full`}>
                                {show_wishlist_books}
                            </div>
                        }
                        {!user_info?.is_vendor && user === auth_user.username && orders_history.length === 0 && user_isActive.order_history &&
                            <NotFoundContainer
                                src={is_dark_mode ? '/profile/dark-order-history-active.svg' : `/profile/order-history-not-active.svg`}
                                content={translation.you_have_no_orders_yet}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {user_info?.is_vendor && user === auth_user.username && reviews_count === 0 && vendor_isActive.reviews &&
                            <NotFoundContainer
                                src={`/profile/reviews-not-found.svg`}
                                content={translation.your_books_have_no_reviews}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {user_info?.is_vendor && reviews_count > 0 && (is_visited_vendor_sections_active.reviews || vendor_isActive.reviews) &&
                            <Reviews
                                reviews={reviews}
                                setReviews={setReviews}
                                next_page_url={reviews_next_page_url}
                                setNext_page_url={setReviews_next_page_url}
                                is_loading={reviews_is_loading}
                                setIs_loading={setReviews_is_loading}
                                is_fetching={reviews_is_fetching}
                                setIs_fetching={setReviews_is_fetching}
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
