import {enqueueSnackbar, SnackbarProvider} from "notistack";
import {Link, useNavigate} from "react-router-dom";
import TextInputAuth from "../../components/core/Text-Input-Auth.tsx";
import LoginProviders from "../../components/LoginProviders.tsx";
import Footer from "../../components/Footer.tsx";
import {ChangeEvent, FormEvent, useRef, useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {sign_up_validation} from "../../../zod-validation/sign-up.ts";
import {z} from "zod";
import {useDispatch} from "react-redux";
import {setUser} from "../../../redux/user-slice.ts";
import apiClient from "../../../ApiClient.ts";

type Errors = {
    username?: string
    email?: string
    password?: string
    password_confirmation?: string
    recaptcha?: string
}

type FormData = {
    username?: string
    email?: string
    password?: string
    password_confirmation?: string
    google_recaptcha?: string | null
}

export default function SignUp() {

    const dispatch = useDispatch();

    const is_sign_in_page = location.pathname === '/sign-in';
    const navigate = useNavigate()

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        google_recaptcha: '',
    })
    const [errors, setErrors] = useState<Errors | null>(null)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleRecaptchaToken = (token: string | null) => {
        setFormData(prevState => ({
            ...prevState,
            google_recaptcha: token
        }))
    }

    const validateForm = () => {
        try {
            sign_up_validation.parse(formData)
            setErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.reduce((acc, err) => {
                    (acc as Record<string, string>)[err.path[0]] = err.message
                    return acc
                }, {} as Record<string, string>)

                setErrors(errors)
            }
            return false
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        if (!formData.google_recaptcha) {
            setErrors(prevErrors => ({ ...prevErrors, recaptcha: 'Please complete the reCAPTCHA.' }))
            return
        }

        apiClient().post(`/sign-up`, formData, {headers: {'Content-Type': 'application/json'}})
            .then(res => {
                dispatch(setUser(res.data.data))
                enqueueSnackbar("Sign up successful! Redirecting...", { variant: "success" });
                setTimeout(() => {
                    navigate('/sign-in')
                }, 2000)
            })
            .catch(err => {
                setErrors(err.response.data.errors)
                enqueueSnackbar('Registration process failed!', { variant: "error" });
            })
    }

    return (
        <>
            <img
                src="./home/hero-section-bg.svg"
                alt="Auth background"
                className={`w-screen h-svh min-h-svh absolute !z-10`}
            />

            <div className={`min-h-svh h-svh z-20 relative flex justify-center pt-20 ${is_sign_in_page ? 'custom-scrollbar' : ''} overflow-y-scroll`}>

                <div className={`flex flex-col px-2 items-center`}>

                    <SnackbarProvider
                        autoHideDuration={2000}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    />

                    <div className={`bg-white rounded-2xl flex flex-col gap-y-5 md:px-40 min-[450px]:px-10 w-full min-[450px]:w-fit px-3 py-10 border`}>
                        <div className={`flex flex-col items-center gap-y-4`}>
                            <Link to={`/`}>
                                <img
                                    src={`/logo.svg`}
                                    alt={`logo`}/>
                            </Link>
                            <h1 className={`font-roboto-bold text-xl text-main_color_darker`}>Sign up</h1>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={`flex flex-col gap-y-5`}>
                                <TextInputAuth
                                    placeholder={`Username`}
                                    id={`username_id`}
                                    name={`username`}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    error={errors?.username}
                                />
                                <TextInputAuth
                                    placeholder={`Email`}
                                    id={`email_id`}
                                    name={`email`}
                                    type={`email`}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={errors?.email}
                                />
                                <TextInputAuth
                                    placeholder={`Password`}
                                    id={`password_id`}
                                    type={`password`}
                                    name={`password`}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    error={errors?.password}
                                />
                                <TextInputAuth
                                    placeholder={`Password Confirmation`}
                                    id={`password_confirmation_id`}
                                    type={`password`}
                                    name={`password_confirmation`}
                                    value={formData.password_confirmation}
                                    onChange={handleInputChange}
                                    error={errors?.password_confirmation}
                                />

                                <div className={`flex flex-col`}>
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY!}
                                        onChange={handleRecaptchaToken}
                                    />

                                    {errors?.recaptcha && <span className={`text-red-600`}>{errors.recaptcha}</span>}
                                </div>

                                <button
                                    className={`bg-main_color text-white rounded h-[46px] font-roboto-semi-bold text-lg`}
                                    type={`submit`}
                                >
                                    Sign up
                                </button>
                            </div>
                        </form>

                        <div className={`text-text_color/70 text-center`}>
                            By signing up, you agree to our
                            <Link to={`#`} className={`text-main_color_darker font-roboto-semi-bold hover:underline underline-offset-2 ml-1`}>Terms</Link>,
                            <Link to={`#`} className={`text-main_color_darker font-roboto-semi-bold hover:underline underline-offset-2 ml-1`}>Data Policy</Link> <br/> and
                            <Link to={`#`} className={`text-main_color_darker font-roboto-semi-bold hover:underline underline-offset-2 ml-1`}>Cookies Policy</Link>.
                        </div>

                        <div className="flex items-center justify-center">
                            <hr className="w-1/2 border-t border-gray-300" />
                            <span className="mx-4 text-gray-500">OR</span>
                            <hr className="w-1/2 border-t border-gray-300" />
                        </div>

                        <div className={`text-center text-lg`}>
                            Have an account? <Link to={`/sign-in`} className={`text-main_color_darker font-bold hover:underline underline-offset-2`}>Login</Link> <br/>
                            Forget Password? <Link to={`#`} className={`text-main_color_darker font-bold hover:underline underline-offset-2`}>Restore Password</Link>
                        </div>

                        <div className="flex items-center justify-center">
                            <hr className="w-1/2 border-t border-gray-300" />
                            <span className="mx-4 text-gray-500">OR</span>
                            <hr className="w-1/2 border-t border-gray-300" />
                        </div>

                        <LoginProviders/>
                    </div>
                    <Footer styles={`text-white border-none`}/>
                </div>
            </div>
        </>

    )
}
