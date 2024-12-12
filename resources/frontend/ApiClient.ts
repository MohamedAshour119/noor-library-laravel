import axios from "axios";

const instance = () => {

    return axios.create({
        baseURL: `/api`,
        headers: {
            'Accept': 'application/json',
            'Authorization':'Bearer ' + localStorage.getItem('token')
        }
    });
}

export default instance;
