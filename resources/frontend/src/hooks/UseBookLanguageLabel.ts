import { useState, useEffect } from "react";
import apiClient from "../../ApiClient.ts";
import { enqueueSnackbar } from "notistack";

type OtherBookOptions = {
    value: string;
    label: string;
    type: string;
};

export const useBookLanguageLabel = (language_value: string | undefined) => {
    const [languagesOptions, setLanguagesOptions] = useState<OtherBookOptions[]>([]);

    useEffect(() => {
        // Make the API call when the component mounts
        apiClient()
            .get("/add-book-options/true")
            .then((res) => {
                setLanguagesOptions(res.data.data.languages_options);
            })
            .catch(() => {
                enqueueSnackbar("Can't fetch the options", { variant: "error" });
            });
    }, []); // Empty dependency array means this effect runs once when the component mounts

    const languageLabel = languagesOptions.find(
        (lang) => lang.value === language_value
    )?.label;

    return { languageLabel };
};
