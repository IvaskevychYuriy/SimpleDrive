import axios, { AxiosResponse } from 'axios';
import authenticationService from '../AuthenticationService';

const http = axios.create({
    withCredentials: true,
    baseURL: 'api/',
    headers: {
        'Accept': 'application/json'
    }
});
http.interceptors.response.use(undefined, error => {
    const response: AxiosResponse = error.response;
    
    if (response.status === 401) {
        authenticationService.userProfile = null;
    }
    
    throw error;
});
export default http;
