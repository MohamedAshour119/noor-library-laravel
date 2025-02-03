import {enqueueSnackbar} from "notistack";
import {Link, useNavigate} from "react-router-dom";
import TextInputAuth from "../../components/core/TextInputAuth.tsx";
import LoginProviders from "../../components/LoginProviders.tsx";
import Footer from "../../components/Footer.tsx";
import {ChangeEvent, FormEvent, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../../redux/user-slice.ts";
import apiClient from "../../../ApiClient.ts";
import {RootState} from "../../../redux/store.ts";
import {useDarkMode} from "../../hooks/UseDarkMode.ts";

export default function SignIn() {
    const is_sign_in_page = location.pathname === '/sign-in';
    const navigate = useNavigate()

    const translation = useSelector((state: RootState) => state.translationReducer)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [signInError, setSignInError] = useState(null);


    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        apiClient().post('/sign-in', formData)
            .then(res => {
                console.log(res.data.data.data)
                setIsLoading(false)
                localStorage.setItem('token', res.data.data.token)
                localStorage.setItem('expires_at', res.data.data.expires_at)
                dispatch(setUser(res.data.data.data))
                navigate('/')
            })
            .catch(err => {
                console.log(err.response)
                setIsLoading(false)
                setSignInError(err.response.data.errors.message)
                enqueueSnackbar(err.response.data.errors.message, { variant: "error" });
            })
    }

    const googleSignIn = () => {
        window.location.href = '/auth/google/redirect';
    }
    const twitterSignIn = () => {
        window.location.href = '/auth/twitter/redirect';
    }

    const is_dark_mode = useDarkMode()

    return (
        <>
            {!is_dark_mode &&
                <img
                    src="/home/hero-section-bg.svg"
                    alt="Auth background"
                    className={`w-screen h-svh min-h-svh absolute !z-10`}
                />
            }
            {is_dark_mode &&
                <div className={`w-screen h-svh min-h-svh absolute !z-10 bg-dark_main_color`}></div>
            }

            <div className={`dark:text-dark_text_color min-h-svh h-svh z-20 px-2 relative flex flex-col items-center pt-20 ${is_sign_in_page ? 'custom-scrollbar' : ''} overflow-y-scroll`}>
                <div className={`bg-white dark:bg-dark_second_color dark:border-dark_border_color rounded-2xl flex flex-col gap-y-5 sm:px-32 md:px-40 min-[450px]:px-10 w-full min-[450px]:w-fit max-w-[680px] px-3 py-10 border`}>
                    <div className={`flex flex-col items-center gap-y-4`}>
                        <Link to={`/`}>
                            <img
                                src={is_dark_mode ? '/dark-logo.svg' : `/logo.svg`}
                                alt={`logo`}/>
                        </Link>
                        <h1 className={`font-roboto-bold text-xl text-main_color_darker dark:text-dark_text_color`}>{translation.sign_in}</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className={`flex flex-col gap-y-5`}>
                            <TextInputAuth
                                onChange={handleFormChange}
                                placeholder={translation.email}
                                id={`email_id`}
                                name={`email`}
                                type={`email`}
                                is_sign_in_failed={!!signInError}
                            />
                            <TextInputAuth
                                onChange={handleFormChange}
                                placeholder={translation.password}
                                id={`password_id`}
                                type={`password`}
                                name={`password`}
                                is_sign_in_failed={!!signInError}
                            />
                            {signInError && <span className={`text-red-600 -mt-4`}>{signInError}</span>}

                            <button
                                className={`bg-main_color dark:bg-dark_main_color dark:border dark:border-dark_border_color text-white rounded h-[46px] font-roboto-semi-bold text-lg`}
                                type={`submit`}
                            >
                                {isLoading ? translation.signing_in : translation.sign_in}
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center justify-center">
                        <hr className="w-1/2 border-t border-gray-300" />
                        <span className="mx-4 text-gray-500">{translation.or}</span>
                        <hr className="w-1/2 border-t border-gray-300" />
                    </div>

                    <div className={`text-center text-lg`}>
                        {translation.dont_have_an_account} <Link to={`/sign-up`} className={`text-main_color_darker dark:text-dark_icon_color font-bold hover:underline underline-offset-2`}>{translation.sign_up}</Link> <br/>
                        {translation.forgot_password} <Link to={`#`} className={`text-main_color_darker dark:text-dark_icon_color font-bold hover:underline underline-offset-2`}>{translation.reset_password}</Link>
                    </div>

                    <div className="flex items-center justify-center">
                        <hr className="w-1/2 border-t border-gray-300" />
                        <span className="mx-4 text-gray-500">OR</span>
                        <hr className="w-1/2 border-t border-gray-300" />
                    </div>
                    <LoginProviders
                        googleSignIn={googleSignIn}
                        twitterSignIn={twitterSignIn}
                    />
                </div>
                <Footer styles={`text-white border-t-0`}/>
            </div>
        </>
    )
}
