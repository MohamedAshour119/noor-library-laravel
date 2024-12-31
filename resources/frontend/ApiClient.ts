import axios from "axios";

const instance = () => {
    // const language = localStorage.getItem('language')?.replace(/^"|"$/g, '')
    return axios.create({
        baseURL: `/api`,
        headers: {
            'Accept': 'application/json',
            'Authorization':'Bearer ' + localStorage.getItem('token'),
            // 'Accept-Language': language,
        }
    });
}

export default instance;
