import {FaCamera, FaStar} from "react-icons/fa";
import Sections from "../components/profile/Sections.tsx";
import NotFoundContainer from "../components/profile/Not-Found-Container.tsx";
import BookPlaceholder from "../components/profile/Book-Placeholder.tsx";
import Footer from "../components/Footer.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import {Book, Errors, SignUpForm, User} from "../../Interfaces.ts";
import apiClient from "../../ApiClient.ts";
import BookCard from "../components/Book-Card.tsx";
import {enqueueSnackbar, SnackbarProvider} from "notistack";
import {Link, useNavigate, useParams} from "react-router-dom";
import { useLocation } from "react-router-dom";
import TextInputAuth from "../components/core/TextInputAuth.tsx";
import {Button, Label, Modal, Spinner, TextInput} from "flowbite-react";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import {setUser} from "../../redux/user-slice.ts";
import {setUserProfileInfo} from "../../redux/user-profile-info-slice.ts";
export default function Profile() {

    const user_isActive = useSelector((state: RootState) => state.usersProfileIsActiveReducer);
    const vendor_isActive = useSelector((state: RootState) => state.vendorsProfileIsActiveReducer);
    const user_state = useSelector((state: RootState) => state.user)
    const user_info = useSelector((state: RootState) => state.userProfileInfoReducer)
    const is_visited_user_sections_active = useSelector((state: RootState) => state.isVisitedUserSectionsActive);
    const is_visited_vendor_sections_active = useSelector((state: RootState) => state.isVisitedVendorSectionsActive);
    const { user } = useParams()
    const dispatch = useDispatch();

    const [books, setBooks] = useState<Book[]>([]);
    const [reviews, setReviews] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [orders_history, setOrders_history] = useState([]);
    const [books_next_page_url, setBooks_next_page_url] = useState('');
    const [is_fetching, setIs_fetching] = useState(false);
    const [is_loading, setIs_loading] = useState(true);
    const [books_count, setBooks_count] = useState(0);
    const [formData, setFormData] = useState<SignUpForm>({
        first_name: user_state.first_name,
        last_name: user_state.last_name,
        phone_number: user_state.phone,
        country_code: '',
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
    const [temp_token, setTemp_token] = useState('');
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
                setIs_loading(false)
                setIs_fetching(false)
            })
    }
    const getUserInfo = () => {
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

    const last_book_ref = useRef(null);
    const show_books = books.map((book, index) => (
            <BookCard
                key={index}
                rate={140}
                title={book.title}
                cover={book.cover}
                author={book.author}
                ref={last_book_ref}
                styles={`w-full`}
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
                setTemp_token('')
                setIs_edit_active(false)
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
            <SnackbarProvider
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            />
            <Modal
                show={is_confirm_password_open}
                size="sm"
                onClose={handleCloseModal}
                popup
                ref={modal_ref}
            >
                <Modal.Header />
                <Modal.Body className={`pt-0`}>
                    <div className="space-y-4 pb-4">
                        <h3 className="text-xl font-roboto-semi-bold text-gray-900">Confirm who you are.</h3>
                        <div className={`relative`}>
                            <Label
                                htmlFor="confirm_user_password"
                                value="Current Password"
                                className={`absolute !text-black/40 text-md cursor-text left-4 top-1/2 -translate-y-1/2 px-1 z-10 transition-all duration-200 ${confirm_user_password.length > 0 || is_confirm_user_password_input_focused ? '!text-sm !top-0 !text-text_color bg-white' : 'bg-transparent'}`}
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
                                {!is_loading_password_confirmation && "Confirm"}
                            </Button>
                        </div>
                    </div>
                    <span className={`text-main_color_darker font-roboto-semi-bold`}>For your security, you’ll need to confirm your password again if you refresh the page.</span>

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
                                        Save
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
                                        placeholder={!is_edit_active && formData.first_name?.length !== 0 ? '' : `First Name`}
                                        id={`first_name_id`}
                                        name={`first_name`}
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        error={errors?.first_name}
                                        readonly={!is_edit_active}
                                        disable_label_animation
                                        styles={`!text-[16px] ${!is_edit_active ? 'cursor-not-allowed' : ''}`}
                                    />
                                    <TextInputAuth
                                        placeholder={!is_edit_active && formData.last_name?.length !== 0? '' : `Last Name`}
                                        id={`last_name_id`}
                                        name={`last_name`}
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        error={errors?.last_name}
                                        readonly={!is_edit_active}
                                        disable_label_animation
                                        styles={`!text-[16px] ${!is_edit_active ? 'cursor-not-allowed' : ''}`}
                                    />

                                    <TextInputAuth
                                        placeholder={!is_edit_active && formData.email?.length !== 0 ? '' : `Email`}
                                        id={`email_id`}
                                        name={`email`}
                                        type={`email`}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={errors?.email}
                                        readonly={!is_edit_active}
                                        disable_label_animation
                                        styles={`!text-[16px] ${!is_edit_active ? 'cursor-not-allowed' : ''}`}
                                    />
                                    <TextInputAuth
                                        placeholder={`New Password`}
                                        id={`password_id`}
                                        type={`password`}
                                        name={`password`}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        error={errors?.password}
                                        readonly={!is_edit_active}
                                        styles={`!text-[16px] ${!is_edit_active ? 'cursor-not-allowed' : ''}`}
                                    />
                                    <TextInputAuth
                                        placeholder={`Password Confirmation`}
                                        id={`password_confirmation_id`}
                                        type={`password`}
                                        name={`password_confirmation`}
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        error={errors?.password_confirmation}
                                        readonly={!is_edit_active}
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
                                            padding: '10px 10px 10px 45px',
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
                                        {!is_edit_active ? 'Edit' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        }
                        {user_info?.is_vendor && user !== user_state.username && books.length === 0 && is_visited_vendor_sections_active.books &&
                            (
                                <NotFoundContainer
                                    src={`/profile/books-not-found.svg`}
                                    visited_user={display_name}
                                    content={`has no books yet.`}
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
                                content={`has no reviews.`}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user !== user_state.username && wishlist.length === 0 && is_visited_user_sections_active.wishlist &&
                            <NotFoundContainer
                                src={`/profile/wishlist-not-active.svg`}
                                visited_user={display_name}
                                content={`has nothing in wishlist.`}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user !== user_state.username && reviews.length === 0 && is_visited_user_sections_active.reviews &&
                            <NotFoundContainer
                                src={`/profile/reviews-not-found.svg`}
                                visited_user={display_name}
                                content={`didn't review any book.`}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user === user_state.username && wishlist.length === 0 && user_isActive.wishlist &&
                            <NotFoundContainer
                                src={`/profile/wishlist-not-active.svg`}
                                content={`You have nothing in wishlist.`}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {!user_info?.is_vendor && user === user_state.username && orders_history.length === 0 && user_isActive.order_history &&
                            <NotFoundContainer
                                src={`/profile/order-history-not-active.svg`}
                                content={`You have no orders yet.`}
                                content_style={`font-roboto-semi-bold`}
                            />
                        }
                        {user_info?.is_vendor && user === user_state.username && reviews.length === 0 && vendor_isActive.reviews &&
                            <NotFoundContainer
                                src={`/profile/reviews-not-found.svg`}
                                content={`Your books have no reviews.`}
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
