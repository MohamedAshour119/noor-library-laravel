import {SnackbarProvider} from "notistack";
import {Link} from "react-router-dom";

export default function SignIn() {
    return (
        <div className={`flex flex-col items-center gap-y-10 container`}>

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
                            placeholder={`Email`}
                            id={`email_id`}
                            name={`email`}
                            type={`email`}
                            error={errors?.email}
                        />
                        <TextInputAuth
                            placeholder={`Password`}
                            id={`password_id`}
                            type={`password`}
                            name={`password`}
                            error={errors?.password}
                        />

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
            <Footer/>
        </div>
    )
}
