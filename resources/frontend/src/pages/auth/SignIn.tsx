import {enqueueSnackbar, SnackbarProvider} from "notistack";
import {Link, useNavigate} from "react-router-dom";
import TextInputAuth from "../../components/core/Text-Input-Auth.tsx";
import LoginProviders from "../../components/Login-Providers.tsx";
import Footer from "../../components/Footer.tsx";
import {ChangeEvent, FormEvent, useState} from "react";
import {useDispatch} from "react-redux";
import {z} from "zod";
import {sign_in_validation} from "../../../zod-validation/sign-in.ts";
import axios from "axios";
import {setUser} from "../../../redux/user-slice.ts";

type Errors = {
    email?: string
    password?: string
}
export default function SignIn() {
    const is_sign_in_page = location.pathname === '/sign-in';
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const [errors, setErrors] = useState<Errors | null>(null)
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

    const validateForm = () => {
        try {
            sign_in_validation.parse(formData)
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (!validateForm()) {
            setIsLoading(false)
            return
        }

        axios.post('/api/sign-in', formData, {headers: {'Content-Type': 'application/json'}})
            .then(res => {
                console.log(res.data.data.data)
                setIsLoading(false)
                dispatch(setUser(res.data.data.data))
                localStorage.setItem('token', res.data.data.token)
                localStorage.setItem('expires_at', res.data.data.expires_at)
                navigate('/')
            })
            .catch(err => {
                setIsLoading(false)
                setSignInError(err.response.data.message)
                enqueueSnackbar(err.response.data.message, { variant: "error" });
            })
    }

    return (
        <>
            <img
                src="./home/hero-section-bg.svg"
                alt="Auth background"
                className={`w-screen h-svh min-h-svh absolute !z-10`}
            />

            <div className={`min-h-svh h-svh z-20 px-2 relative flex flex-col items-center pt-20 ${is_sign_in_page ? 'custom-scrollbar' : ''} overflow-y-scroll`}>

                <SnackbarProvider
                    autoHideDuration={3000}
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
                        <h1 className={`font-roboto-bold text-xl text-main_color_darker`}>Sign in</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className={`flex flex-col gap-y-5`}>
                            <TextInputAuth
                                onChange={handleFormChange}
                                placeholder={`Email`}
                                id={`email_id`}
                                name={`email`}
                                type={`email`}
                                error={errors?.email}
                                is_sign_in_failed={!!signInError}
                            />
                            <TextInputAuth
                                onChange={handleFormChange}
                                placeholder={`Password`}
                                id={`password_id`}
                                type={`password`}
                                name={`password`}
                                error={errors?.password}
                                is_sign_in_failed={!!signInError}
                            />
                            {signInError && <span className={`text-red-600 -mt-4`}>{signInError}</span>}

                            <button
                                className={`bg-main_color text-white rounded h-[46px] font-roboto-semi-bold text-lg`}
                                type={`submit`}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center justify-center">
                        <hr className="w-1/2 border-t border-gray-300" />
                        <span className="mx-4 text-gray-500">OR</span>
                        <hr className="w-1/2 border-t border-gray-300" />
                    </div>

                    <div className={`text-center text-lg`}>
                        Don't have an account? <Link to={`/sign-up`} className={`text-main_color_darker font-bold hover:underline underline-offset-2`}>Sign up</Link> <br/>
                        Forget Password? <Link to={`#`} className={`text-main_color_darker font-bold hover:underline underline-offset-2`}>Restore Password</Link>
                    </div>

                    <div className="flex items-center justify-center">
                        <hr className="w-1/2 border-t border-gray-300" />
                        <span className="mx-4 text-gray-500">OR</span>
                        <hr className="w-1/2 border-t border-gray-300" />
                    </div>
                    <LoginProviders/>
                </div>
                <Footer styles={`text-white border-t-0`}/>
            </div>
        </>
    )
}
