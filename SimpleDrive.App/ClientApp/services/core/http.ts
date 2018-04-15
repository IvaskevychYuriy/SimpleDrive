import axios from 'axios';

const http = axios.create({
    withCredentials: true,
    baseURL: 'api/',
    headers: {
        'Accept': 'application/json'
    }
});

export default http;
