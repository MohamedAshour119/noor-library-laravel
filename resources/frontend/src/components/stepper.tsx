import { useState } from "react";

const Stepper = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const steps = ["Step 1", "Step 2", "Step 3"];

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const progressWidth = `${((currentStep - 1) / (steps.length - 1)) * 100}%`;

    return (
        <div className="w-[80%] mx-auto mt-10">
            {/* Progress Bar */}
            <div className="relative">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                        className="h-2 bg-main_color rounded-full transition-all duration-300"
                        style={{ width: progressWidth }}
                    ></div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`size-14 flex items-center justify-center rounded-full border-2 ${
                                currentStep > index
                                    ? "border-main_color_darker bg-main_color_darker text-white"
                                    : "border-gray-300 bg-white text-gray-500"
                            } transition-all duration-300`}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={handleNext}
                    disabled={currentStep === steps.length}
                    className={`px-4 py-2 rounded ${
                        currentStep === steps.length
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-main text-white"
                    } transition-all duration-300`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Stepper;
