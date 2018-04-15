import http from "./core/http";
import { AxiosResponse } from "axios";

import { LoginInfo } from "../models/login-model";
import { UserProfile } from "../models/user-profile";

class AuthenticationService {
    private static readonly CURRENT_USER_KEY = 'currentUser';

    private _userProfile: UserProfile;

    constructor() { 
        this._userProfile = JSON.parse(localStorage.getItem(AuthenticationService.CURRENT_USER_KEY));
        this.handleResponse = this.handleResponse.bind(this);
    }

    get userProfile(): UserProfile {
        return this._userProfile;
    }

    login(model: LoginInfo) {
        return http.post<UserProfile>('home/login', JSON.stringify(model))
            .then(this.handleResponse);
    }
    
    register(model: LoginInfo) {
        return http.post<UserProfile>('home/register', JSON.stringify(model))
            .then(this.handleResponse);
    }

    logout() {
        this._userProfile = null;
        localStorage.removeItem(AuthenticationService.CURRENT_USER_KEY);
        
        return http.post('home/logout');
    }

    private handleResponse(response : AxiosResponse<UserProfile>) : UserProfile {
        this._userProfile = response.data;
        localStorage.setItem(AuthenticationService.CURRENT_USER_KEY, JSON.stringify(this._userProfile));
        return this._userProfile;
    }
}

export default new AuthenticationService()