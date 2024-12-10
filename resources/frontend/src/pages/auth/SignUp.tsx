import {SnackbarProvider} from "notistack";
import {Link} from "react-router-dom";
import TextInputAuth from "../../components/core/Text-Input-Auth.tsx";
import ReCAPTCHA from "react-google-recaptcha";
import LoginProviders from "../../components/Login-Providers.tsx";
import Footer from "../../components/Footer.tsx";

export default function SignUp() {

    const handleInputChange = () => {

    }
    const handleSubmit = () => {

    }

    return (
        <div className={`flex flex-col items-center gap-y-10 container`}>

            <SnackbarProvider
                autoHideDuration={2000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            />

            <div className={`bg-white  rounded-2xl flex flex-col gap-y-5 md:px-40 min-[450px]:px-10 w-full min-[450px]:w-fit px-3 py-10 border`}>
                <div className={`flex flex-col items-center gap-y-4`}>
                    <Link to={`/`}>
                        <img
                            src={`/logo.svg`}
                            alt={`logo`}/>
                    </Link>
                    <h1 className={`font-roboto-bold text-xl text-main_color_darker`}>Sign up</h1>
                </div>
                <form onSubmit={handleSubmit} action={`/sign-up`}>
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
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                                onChange={(token) => setRecaptchaToken(token)}
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
            <Footer/>
        </div>
    )
}
