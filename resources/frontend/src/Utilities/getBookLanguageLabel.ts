// Fetch the label for the book's language based on its value

import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";

export const get_book_language_label = (language_value: string) => {

    const languagesOptions = useSelector((state: RootState) => state.languagesOptionsReducer)

    const language = languagesOptions.find(lang => lang.value === language_value);
    return language ? language.label : undefined;
};
