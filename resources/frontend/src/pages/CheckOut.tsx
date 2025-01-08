import Footer from "../components/Footer.tsx";
import {Progress} from "flowbite-react";
import {useState} from "react";

export default function CheckOut() {

    const [is_active, setIs_active] = useState({
        contact: true,
        shipping: false,
        payment: false,
    });

    // const handleChangeIsActive = (value: string) => {
    //     setIs_active({
    //         contact: false,
    //         shipping: false,
    //         payment: false,
    //         [value]: true
    //     })
    // }


    return (
        <div className="flex flex-col justify-between min-h-[643px] h-max text-text_color">
            <div className={`flex flex-col items-center bg-main_bg pt-5 max-sm:px-2 min-h-[586px]`}>
                <div className={`container w-full grid grid-cols-[3fr_1fr] gap-x-10`}>
                    {/* Progress bar */}
                    <div>
                        <div className={`flex flex-col gap-y-4`}>
                            <div className={`pt-1 grid grid-cols-3`}>
                                <div className={`flex flex-col items-center`}>
                                    <span className={`${is_active.contact ? 'bg-main_color text-white' : 'bg-transparent text-disable_color'} border border-main_color size-8 flex justify-center items-center rounded-full`}>
                                        1
                                    </span>
                                    <h1 className={`mt-2`}>Contact</h1>
                                    <h3>Your billing info</h3>
                                </div>
                                <div className={`flex flex-col items-center`}>
                                    <span className={`${is_active.shipping ? 'bg-main_color text-white' : 'bg-transparent text-disable_color'} border border-disable_color size-8 flex justify-center items-center rounded-full`}>
                                        2
                                    </span>
                                    <h1 className={`mt-2 text-disable_color`}>Shipping</h1>
                                    <h3 className={`text-disable_color`}>Where we should ship to</h3>
                                </div>
                                <div className={`flex flex-col items-center`}>
                                    <span className={`${is_active.payment ? 'bg-main_color text-white' : 'bg-transparent text-disable_color'}  border border-disable_color size-8 flex justify-center items-center rounded-full`}>
                                        3
                                    </span>
                                    <h1 className={`mt-2 text-disable_color`}>Payment</h1>
                                    <h3 className={`text-disable_color`}>Confirm your order</h3>
                                </div>

                            </div>
                            <Progress
                                progress={40}
                            />
                        </div>
                    </div>


                    {/*  Check out Sidebar  */}
                    <div className={`bg-red-400`}>Check out Sidebar</div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
